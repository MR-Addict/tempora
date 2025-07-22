import { mount } from 'svelte';

import './main.css';
import App from './App.svelte';

export default mount(App, { target: document.getElementById('app')! });
