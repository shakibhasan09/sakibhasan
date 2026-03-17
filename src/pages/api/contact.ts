import type { APIRoute } from "astro";
import { EmailMessage } from "cloudflare:email";
import { env } from "cloudflare:workers";
import { createMimeMessage } from "mimetext";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return new Response(JSON.stringify({ error: "Invalid content type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body: { name?: string; email?: string; message?: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return new Response(
            JSON.stringify({ error: "All fields are required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new Response(
            JSON.stringify({ error: "Invalid email address" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    try {
        const msg = createMimeMessage();

        msg.setSender(env.FROM_ADDRESS);
        msg.setRecipient(env.TO_ADDRESS);
        msg.setSubject(`Contact form: ${name.trim()}`);

        msg.addMessage({
            contentType: "text/plain",
            data: [
                `Name: ${name.trim()}`,
                `Email: ${email.trim()}`,
                ``,
                message.trim(),
            ].join("\n"),
        });

        const emailMessage = new EmailMessage(
            env.FROM_ADDRESS,
            env.TO_ADDRESS,
            msg.asRaw(),
        );

        const { messageId } = await env.EMAIL.send(emailMessage);

        return new Response(JSON.stringify({ success: true, messageId }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Email send error:", e);
        return new Response(
            JSON.stringify({
                error: "Failed to send email. Please try again.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
