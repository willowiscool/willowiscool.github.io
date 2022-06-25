
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text$5(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$5(' ');
    }
    function empty() {
        return text$5('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function generatePage(text, links) {
    	const lines = text.split("\n");
    	const page = {
    		height: lines.length,
    		width: lines.reduce((mw, line) => Math.max(mw, line.length), 0),
    	};
    	page.cells = Array(page.height).fill().map((row, y) =>
    		Array(page.width).fill().map((cell, x) => {
    			if (lines[y][x] === " ") return {char: "\xa0"}
    			return {char: lines[y][x] || "\xa0"}
    		})
    	);
    	links.forEach(link => {
    		const ind = lines[link.line].indexOf(link.text);
    		if (ind !== -1) {
    			for (let x = ind; x < ind + link.text.length; x++) {
    				if (link.func) page.cells[link.line][x].func = link.func;
    				if (link.href) page.cells[link.line][x].href = link.href;
    			}
    		}
    	});
    	return page
    }

    const text$4 = `
WILLOW VEYTSMAN        she/they

about projects contact personal
`.trim();

    const links$4 = [
    	{
    		text: "about",
    		func: "about",
    		line: 2
    	},
    	{
    		text: "projects",
    		func: "projects",
    		line: 2
    	},
    	{
    		text: "contact",
    		func: "contact",
    		line: 2
    	},
    	{
    		text: "personal",
    		func: "personal",
    		line: 2
    	}
    ];

    const home = generatePage(text$4, links$4);

    const text$3 = `
ABOUT ME                   back

(this is mostly a placeholder
until I figure out something
better)

Welcome to my site! My name is
Willow. I'm eighteen and I live
in Brooklyn, New York. I
recently graduated Stuyvesant
High School and will be
studying at the University of
Rochester this fall.

My hobbies include all things
computers, playing the flute,
playing Minecraft, crocheting,
biking, skiing, and, recently,
doing some makeup every now and
then. Hopefully, by the time
you're reading this, I've
become much better at that.
`.trim();

    const links$3 = [
    	{
    		text: "back",
    		func: "home",
    		line: 0
    	}
    ];

    const about = generatePage(text$3, links$3);

    const text$2 = `
PROJECTS                   back

(My GitHub)

StuyActivities -> a site that
manages club activity for the
over 3000 students at
Stuyvesant High School. Created
as part of the Student Union IT
Department

today.stuysu.org -> a site that
displays important day-to-day
info for Stuyvesant students.

(Student Union IT GitHub)

Projects for school -> TODO

Small project archive -> TODO
`.trim();

    const links$2 = [
    	{
    		text: "back",
    		func: "home",
    		line: 0
    	},
    	{
    		text: "(My GitHub)",
    		href: "https://github.com/willowiscool",
    		line: 2
    	},
    	{
    		text: "StuyActivities",
    		href: "https://stuyactivities.org",
    		line: 4
    	},
    	{
    		text: "today.stuysu.org",
    		href: "https://today.stuysu.org",
    		line: 10
    	},
    	{
    		text: "(Student Union IT GitHub)",
    		href: "https://github.com/stuysu",
    		line: 14
    	}
    ];

    const projects = generatePage(text$2, links$2);

    const text$1 = `
CONTACT ME            back

email -> vityavv@gmail.com
github -> willowiscool
discord -> willow#2639
instagram -> willowis.cool
`.trim();

    const links$1 = [
    	{
    		text: "back",
    		func: "home",
    		line: 0
    	},
    	{
    		text: "vityavv@gmail.com",
    		href: "mailto:vityavv@gmail.com",
    		line: 2
    	},
    	{
    		text: "willowiscool",
    		href: "https://github.com/willowiscool",
    		line: 3
    	},
    	{
    		text: "willowis.cool",
    		href: "https://instagram.com/willowis.cool",
    		line: 5
    	}
    ];

    const contact = generatePage(text$1, links$1);

    const text = `
Coming Soon!

    home
`.trim();

    const links = [
    	{
    		text: "home",
    		func: "home",
    		line: 2
    	}
    ];

    const personal = generatePage(text, links);

    /* src/App.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (111:5) {:else}
    function create_else_block(ctx) {
    	let span;
    	let t_value = /*cell*/ ctx[12].char + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text$5(t_value);
    			attr_dev(span, "class", "svelte-112zgn7");
    			add_location(span, file, 111, 6, 3640);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page*/ 1 && t_value !== (t_value = /*cell*/ ctx[12].char + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(111:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (109:5) {#if cell.char === "\xa0" || cell.char === " "}
    function create_if_block_2(ctx) {
    	let span;
    	let t_value = /*cell*/ ctx[12].char + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text$5(t_value);
    			attr_dev(span, "class", "defaultpointer svelte-112zgn7");
    			add_location(span, file, 109, 6, 3573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page*/ 1 && t_value !== (t_value = /*cell*/ ctx[12].char + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(109:5) {#if cell.char === \\\"\\xa0\\\" || cell.char === \\\" \\\"}",
    		ctx
    	});

    	return block;
    }

    // (106:24) 
    function create_if_block_1(ctx) {
    	let button;
    	let t_value = /*cell*/ ctx[12].char + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*cell*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text$5(t_value);
    			attr_dev(button, "class", "svelte-112zgn7");
    			add_location(button, file, 106, 5, 3425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*page*/ 1 && t_value !== (t_value = /*cell*/ ctx[12].char + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(106:24) ",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if cell.href}
    function create_if_block(ctx) {
    	let a;
    	let t_value = /*cell*/ ctx[12].char + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text$5(t_value);
    			attr_dev(a, "href", a_href_value = /*cell*/ ctx[12].href);
    			attr_dev(a, "class", "svelte-112zgn7");
    			add_location(a, file, 104, 5, 3359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page*/ 1 && t_value !== (t_value = /*cell*/ ctx[12].char + "")) set_data_dev(t, t_value);

    			if (dirty & /*page*/ 1 && a_href_value !== (a_href_value = /*cell*/ ctx[12].href)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(104:4) {#if cell.href}",
    		ctx
    	});

    	return block;
    }

    // (103:3) {#each row as cell}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[12].href) return create_if_block;
    		if (/*cell*/ ctx[12].func) return create_if_block_1;
    		if (/*cell*/ ctx[12].char === "\xa0" || /*cell*/ ctx[12].char === " ") return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(103:3) {#each row as cell}",
    		ctx
    	});

    	return block;
    }

    // (102:2) {#each page.cells as row}
    function create_each_block(ctx) {
    	let t;
    	let br;
    	let each_value_1 = /*row*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			br = element("br");
    			add_location(br, file, 115, 3, 3700);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page, transitionTo, pages*/ 7) {
    				each_value_1 = /*row*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(102:2) {#each page.cells as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let each_value = /*page*/ ctx[0].cells;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "id", "noshrink");
    			attr_dev(div0, "class", "svelte-112zgn7");
    			add_location(div0, file, 100, 1, 3263);
    			attr_dev(div1, "id", "container");
    			attr_dev(div1, "class", "svelte-112zgn7");
    			add_location(div1, file, 99, 0, 3241);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*page, transitionTo, pages*/ 7) {
    				each_value = /*page*/ ctx[0].cells;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const VALIDCHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+`~,./<>?[]\{}|";

    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const pages = { home, about, projects, contact, personal };

    	// get text width
    	// todo update on resize
    	const canvas = document.createElement("canvas");

    	const ctx = canvas.getContext("2d");
    	ctx.font = "20px Inconsolata";
    	const metrics = ctx.measureText(" ");
    	const width = Math.ceil(window.innerWidth / metrics.width);
    	const height = Math.ceil(window.innerHeight / 20);

    	let page = {
    		width,
    		height,
    		cells: Array(height).fill().map(row => Array(width).fill().map(cell => {
    			return {
    				char: VALIDCHARS[Math.floor(Math.random() * VALIDCHARS.length)]
    			};
    		}))
    	};

    	transitionTo(home);

    	async function transitionTo(np, options = {}) {
    		// figure out bounding box of np
    		const heightOffset = Math.floor(page.height / 2 - np.height / 2);

    		const widthOffset = Math.floor(page.width / 2 - np.width / 2);

    		// transition out of current page:
    		// take each coordinate and designate for it a frame to change into a random character. distribute along a bell curve
    		// central limit theorem says random numbers will approach a bell curve when summed together (at least... I think)
    		const NUMFRAMES = 100; // make sure even

    		const genNum = NUMFRAMES => Math.floor(Array(NUMFRAMES / 2).fill().map(_ => Math.random()).reduce((a, b) => a + b, 0) + Math.random() * (NUMFRAMES / 2));

    		const changes = Array(page.height).fill().map(row => Array(page.width).fill().map(cell => {
    			/*
    let num1 = genNum(NUMFRAMES)
    let num2 = genNum(NUMFRAMES)
    return {
    	change1: Math.min(num2, num1),
    	change2: Math.max(num2, num1)
    }*/
    			let change1 = genNum(NUMFRAMES);

    			if (change1 > NUMFRAMES / 2) change1 = NUMFRAMES - change1;
    			let change2 = genNum(NUMFRAMES);
    			if (change2 < NUMFRAMES / 2) change2 = NUMFRAMES - change2;
    			return { change1, change2 };
    		}));

    		for (let frame = 0; frame < NUMFRAMES; frame++) {
    			for (let y = 0; y < page.cells.length; y++) {
    				for (let x = 0; x < page.cells[y].length; x++) {
    					if (changes[y][x].change1 === frame) {
    						$$invalidate(0, page.cells[y][x].char = VALIDCHARS[Math.floor(Math.random() * VALIDCHARS.length)], page);
    						$$invalidate(0, page.cells[y][x].func = undefined, page);
    						$$invalidate(0, page.cells[y][x].href = undefined, page);
    					}

    					if (changes[y][x].change2 === frame) {
    						$$invalidate(0, page.cells[y][x].char = "\xa0", page); //nbsp
    						if (y - heightOffset >= 0 && y - heightOffset < np.height && x - widthOffset >= 0 && x - widthOffset < np.width) $$invalidate(0, page.cells[y][x] = Object.assign({}, np.cells[y - heightOffset][x - widthOffset]), page);
    					}
    				}
    			}

    			await sleep(50);
    			$$invalidate(0, page);
    		}
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = cell => transitionTo(pages[cell.func]);

    	$$self.$capture_state = () => ({
    		home,
    		about,
    		projects,
    		contact,
    		personal,
    		pages,
    		VALIDCHARS,
    		canvas,
    		ctx,
    		metrics,
    		width,
    		height,
    		page,
    		transitionTo,
    		sleep
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, pages, transitionTo, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
