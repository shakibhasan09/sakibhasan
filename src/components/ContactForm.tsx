import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
    const [status, setStatus] = useState<
        "idle" | "sending" | "success" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");

        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement)
                .value,
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = (await res.json()) as { error: string };

            if (!res.ok) {
                setStatus("error");
                setErrorMessage(json.error || "Something went wrong.");
                return;
            }

            setStatus("success");
            form.reset();
        } catch {
            setStatus("error");
            setErrorMessage("Failed to send message. Please try again.");
        }
    }

    if (status === "success") {
        return (
            <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                <p className="text-lg font-medium text-foreground mb-2">
                    Message sent!
                </p>
                <p className="text-sm text-muted-foreground">
                    Thanks for reaching out. I'll get back to you soon.
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setStatus("idle")}
                >
                    Send another message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-1.5"
                >
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-1.5"
                >
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 focus:outline-none transition-colors resize-y"
                    placeholder="What's on your mind?"
                />
            </div>

            {status === "error" && (
                <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <Button type="submit" disabled={status === "sending"} size="lg">
                {status === "sending" ? "Sending..." : "Send message"}
            </Button>
        </form>
    );
}
