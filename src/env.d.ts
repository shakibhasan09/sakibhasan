type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {}
}

declare module "@fontsource-variable/rubik";
declare module "@fontsource-variable/jetbrains-mono";
