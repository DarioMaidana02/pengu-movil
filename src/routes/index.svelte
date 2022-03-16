<script lang="ts">
    import { getRoutes, addRoute } from '$lib/plugins/firebase'
    import { onMount } from 'svelte';
    
    let routes = [];
    let loading = true


    // Una ruta es una lista de puntos
    // Los puntos son una lista con dos elementos numericos
    // el primer valor es la latitud
    // el segundo valor es la longitud
    let route = [[0.35, -25.88]];

    async function onClickaddRoute() {
        const routeId = await addRoute(route)
        routes = await getRoutes()
    }

    onMount(async () => {
        routes = await getRoutes()
        loading = false
    })
</script>

<div>
    {#if loading}
         <h1>Loading...</h1>
    {:else}
         {#each routes as route}
             <h3>id: {route.id}</h3>
             <ul>
                 {#each route.points as point}
                 <li>latitud: {point?._lat} | longitud: {point?._long}</li>
                 {/each}
             </ul>
         {/each}
    {/if}
</div>

<button on:click={onClickaddRoute}>Add Geolocation</button>

