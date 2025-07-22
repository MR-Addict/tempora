<script lang="ts">
	import url from '@/lib/utils/url';

	let serverUrl = $state(url());
</script>

<main>
	<h1>Tempora</h1>
	<p>Server URL: {serverUrl}</p>
</main>
