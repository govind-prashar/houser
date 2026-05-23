import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client } from '@/lib/s3'
import convert from 'heic-convert'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
        }

        const uploadedUrls: string[] = []
        const bucketName = process.env.R2_BUCKET_NAME!
        const publicDomain = process.env.R2_PUBLIC_DOMAIN!

        for (const file of files) {
            if (!file || !(file instanceof File)) continue

            // Detect HEIC files for conversion
            const isHEIC = file.name.toLowerCase().endsWith('.heic') ||
                file.name.toLowerCase().endsWith('.heif') ||
                file.type === 'image/heic' ||
                file.type === 'image/heif';

            // Validate file type (allow HEIC/HEIF for conversion)
            if (!file.type.startsWith('image/') && !isHEIC) {
                continue
            }

            // Validate file size (max 15MB to preserve high quality)
            if (file.size > 15 * 1024 * 1024) {
                continue
            }

            const bytes = await file.arrayBuffer()
            let buffer = Buffer.from(bytes)

            // Generate unique base filename
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(2, 11)
            let extension = file.name.split('.').pop()
            let filename = `properties/${timestamp}-${randomString}.${extension}`

            // Convert HEIC to JPEG
            if (isHEIC) {
                try {
                    const outputBuffer = await convert({
                        buffer: buffer as any,
                        format: 'JPEG',
                        quality: 1.0 // Increased to max quality
                    });
                    buffer = Buffer.from(outputBuffer);
                    extension = 'jpg';
                    filename = `properties/${timestamp}-${randomString}.${extension}`;
                } catch (convError) {
                    console.error('Server-side HEIC conversion failed:', convError);
                }
            }

            // Upload to Cloudflare R2
            await r2Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: filename,
                    Body: buffer,
                    ContentType: extension === 'jpg' ? 'image/jpeg' : file.type,
                })
            );

            // Return public URL (ensure it doesn't have double slashes)
            const baseUrl = publicDomain.endsWith('/') ? publicDomain.slice(0, -1) : publicDomain;
            uploadedUrls.push(`${baseUrl}/${filename}`)
        }

        return NextResponse.json({ urls: uploadedUrls })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload files' },
            { status: 500 }
        )
    }
}

