import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const POSTS_JSON = path.join(process.cwd(), 'src/data/posts.json');

function readPostsLocal() {
    if (!fs.existsSync(POSTS_JSON)) {
        // Try to seed from the static file if it exists
        return [];
    }
    const content = fs.readFileSync(POSTS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writePostsLocal(posts: any[]) {
    fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 4));
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (supabase) {
            const query = supabase.from('posts').select('*').order('date', { ascending: false });
            if (id) query.eq('id', id).single();
            const { data, error } = await query;
            if (error && error.code !== '42P01') throw error;
            if (data) return NextResponse.json(data);
        }

        const posts = readPostsLocal();
        if (id) {
            const post = posts.find((p: any) => p.id === id);
            return post ? NextResponse.json(post) : NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        
        return NextResponse.json(posts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const post = await request.json();
        const newPost = {
            ...post,
            id: post.id || Math.random().toString(36).substr(2, 9),
            date: post.date || new Date().toISOString(),
        };

        if (supabase) {
            const { data, error } = await supabase.from('posts').insert(newPost).select().single();
            if (error && error.code !== '42P01') throw error;
            if (data) return NextResponse.json(data);
        }

        const posts = readPostsLocal();
        posts.push(newPost);
        writePostsLocal(posts);
        return NextResponse.json(newPost);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedPost = await request.json();
        if (!updatedPost.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        if (supabase) {
            const { data, error } = await supabase.from('posts').update(updatedPost).eq('id', updatedPost.id).select().single();
            if (error && error.code !== '42P01') throw error;
            if (data) return NextResponse.json(data);
        }

        const posts = readPostsLocal();
        const index = posts.findIndex((p: any) => p.id === updatedPost.id);
        if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        
        posts[index] = { ...posts[index], ...updatedPost };
        writePostsLocal(posts);
        return NextResponse.json(posts[index]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        if (supabase) {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error && error.code !== '42P01') throw error;
        }

        const posts = readPostsLocal();
        const filteredPosts = posts.filter((p: any) => p.id !== id);
        writePostsLocal(filteredPosts);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
