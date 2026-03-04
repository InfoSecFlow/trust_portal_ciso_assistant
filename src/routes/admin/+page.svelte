<script lang="ts">
	let authenticated = $state(false);
	let password = $state('');
	let loginError = $state('');
	let saving = $state(false);
	let saveMessage = $state('');

	let config = $state({
		portalName: '',
		portalDescription: '',
		logoPath: '',
		primaryColor: '#2563eb',
		accentColor: '#7c3aed',
		footerText: ''
	});

	let logoFile = $state<File | null>(null);
	let logoPreview = $state('');

	async function login() {
		loginError = '';
		const res = await fetch('/api/admin/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ password })
		});
		if (res.ok) {
			authenticated = true;
			password = '';
			await loadConfig();
		} else {
			const data = await res.json();
			loginError = data.error || 'Login failed';
		}
	}

	async function loadConfig() {
		const res = await fetch('/api/admin/config');
		if (res.ok) {
			const data = await res.json();
			config = { ...config, ...data };
			if (config.logoPath) logoPreview = config.logoPath;
		} else if (res.status === 401) {
			authenticated = false;
		}
	}

	function onLogoSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		logoFile = file;
		logoPreview = URL.createObjectURL(file);
	}

	function removeLogo() {
		logoFile = null;
		logoPreview = '';
		config.logoPath = '';
	}

	async function save() {
		saving = true;
		saveMessage = '';

		try {
			if (logoFile) {
				const form = new FormData();
				form.append('logo', logoFile);
				const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: form });
				if (uploadRes.ok) {
					const data = await uploadRes.json();
					config.logoPath = data.logoPath;
					logoFile = null;
				} else {
					const err = await uploadRes.json();
					saveMessage = `Logo upload failed: ${err.error}`;
					saving = false;
					return;
				}
			}

			const res = await fetch('/api/admin/config', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(config)
			});

			if (res.ok) {
				saveMessage = 'Configuration saved successfully';
				setTimeout(() => (saveMessage = ''), 3000);
			} else {
				const err = await res.json();
				saveMessage = `Save failed: ${err.error}`;
			}
		} catch {
			saveMessage = 'An error occurred while saving';
		}

		saving = false;
	}
</script>

<svelte:head>
	<title>Admin — Portal Settings</title>
</svelte:head>

<div class="mx-auto max-w-2xl py-8">
	{#if !authenticated}
		<div class="rounded-xl border border-gray-200 bg-white p-8">
			<h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
			<p class="mt-2 text-sm text-gray-500">Enter the admin password to manage portal settings.</p>

			<form class="mt-6 space-y-4" onsubmit={(e) => { e.preventDefault(); login(); }}>
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
						placeholder="Admin password"
					/>
				</div>
				{#if loginError}
					<p class="text-sm text-red-600">{loginError}</p>
				{/if}
				<button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
					Sign In
				</button>
			</form>
		</div>
	{:else}
		<div class="space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Portal Settings</h1>
					<p class="mt-1 text-sm text-gray-500">Customize branding and appearance for your trust portal.</p>
				</div>
				<a href="/" class="text-sm text-gray-400 hover:text-gray-600">&larr; Back to portal</a>
			</div>

			<!-- Branding -->
			<section class="rounded-xl border border-gray-200 bg-white p-6">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Branding</h2>
				<div class="mt-4 space-y-4">
					<div>
						<label for="portalName" class="block text-sm font-medium text-gray-700">Portal Name</label>
						<input
							id="portalName"
							type="text"
							bind:value={config.portalName}
							class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
						/>
					</div>
					<div>
						<label for="portalDescription" class="block text-sm font-medium text-gray-700">Description</label>
						<input
							id="portalDescription"
							type="text"
							bind:value={config.portalDescription}
							class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
						/>
					</div>
					<div>
						<label for="footerText" class="block text-sm font-medium text-gray-700">Footer Text <span class="text-gray-400">(optional)</span></label>
						<input
							id="footerText"
							type="text"
							bind:value={config.footerText}
							class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
							placeholder="e.g. © 2026 Acme Corp"
						/>
					</div>
				</div>
			</section>

			<!-- Logo -->
			<section class="rounded-xl border border-gray-200 bg-white p-6">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Logo</h2>
				<div class="mt-4">
					{#if logoPreview}
						<div class="flex items-center gap-4">
							<div class="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2">
								<img src={logoPreview} alt="Logo preview" class="max-h-12 max-w-12 object-contain" />
							</div>
							<div>
								<p class="text-sm text-gray-600">{config.logoPath || logoFile?.name || 'New logo'}</p>
								<button onclick={removeLogo} class="mt-1 text-xs text-red-500 hover:text-red-700">Remove logo</button>
							</div>
						</div>
					{:else}
						<p class="text-sm text-gray-500">No logo uploaded. The default shield icon will be used.</p>
					{/if}
					<label class="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
						<i class="fa-solid fa-upload text-xs"></i>
						Upload Logo
						<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" class="hidden" onchange={onLogoSelect} />
					</label>
					<p class="mt-2 text-xs text-gray-400">PNG, JPEG, SVG, or WebP. Max 2MB.</p>
				</div>
			</section>

			<!-- Colors -->
			<section class="rounded-xl border border-gray-200 bg-white p-6">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Theme Colors</h2>
				<div class="mt-4 grid gap-4 sm:grid-cols-2">
					<div>
						<label for="primaryColor" class="block text-sm font-medium text-gray-700">Primary Color</label>
						<div class="mt-1 flex items-center gap-2">
							<input
								id="primaryColor"
								type="color"
								bind:value={config.primaryColor}
								class="h-10 w-10 cursor-pointer rounded border border-gray-200"
							/>
							<input
								type="text"
								bind:value={config.primaryColor}
								class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
							/>
						</div>
						<p class="mt-1 text-xs text-gray-400">Used for active nav items, links, buttons</p>
					</div>
					<div>
						<label for="accentColor" class="block text-sm font-medium text-gray-700">Accent Color</label>
						<div class="mt-1 flex items-center gap-2">
							<input
								id="accentColor"
								type="color"
								bind:value={config.accentColor}
								class="h-10 w-10 cursor-pointer rounded border border-gray-200"
							/>
							<input
								type="text"
								bind:value={config.accentColor}
								class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
							/>
						</div>
						<p class="mt-1 text-xs text-gray-400">Used for secondary elements, highlights</p>
					</div>
				</div>

				<!-- Preview -->
				<div class="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
					<p class="mb-3 text-xs font-medium text-gray-400">Preview</p>
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white" style:background-color={config.primaryColor}>
							{#if logoPreview}
								<img src={logoPreview} alt="" class="h-5 w-5 object-contain" />
							{:else}
								<i class="fa-solid fa-shield-halved"></i>
							{/if}
							{config.portalName || 'Trust Center'}
						</div>
						<span class="rounded-lg px-3 py-1 text-xs font-medium text-white" style:background-color={config.accentColor}>Accent</span>
					</div>
				</div>
			</section>

			<!-- Save -->
			<div class="flex items-center justify-between">
				<div>
					{#if saveMessage}
						<p class="text-sm {saveMessage.includes('failed') || saveMessage.includes('error') ? 'text-red-600' : 'text-emerald-600'}">{saveMessage}</p>
					{/if}
				</div>
				<button
					onclick={save}
					disabled={saving}
					class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</div>
	{/if}
</div>
