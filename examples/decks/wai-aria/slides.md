---

title: HTML - WAI-ARIA
description: Session on WAI-ARIA for National Coding Week.
paginate: true
marp: true
theme: purple-theme

---

# HTML - WAI-ARIA
Craig Abbott
Head of Accessibility, Digital
[@abbott567](https://twitter.com/abbott567)

---

## What is WAI-ARIA?

WAI stands for <i>Web Accessibility Initiative</i>. They are part of the [World Wide Web Consortium (W3C)](https://www.w3.org/) who develop standards and support materials for accessibility.

ARIA stands for <i>Accessible Rich Internet Applications</i>.

---

### Why is it important?

The internet is full of beautiful interfaces and exciting interactions. ARIA is used to make these experiences more inclusive by making them work with assitive technologies.

It is also important to pass [WCAG 2.1 criterion 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html).

---

### What does it do?

It adds additional context for assistive technology users, for dynamic content and advanced user interface controls.

---

### How does it work?

ARIA modifies the Accessibility Tree, which is what assistive technology uses to present content to your user. 

It does *not* change anything about an elements look, function or behaviour.

---

## The Accessibility Tree

Assistive technology cannot see your HTML in the Document Object Model (DOM). 

It can only read the Accessibility Tree which is built automatically by the browser using your HTML code.

You cannot edit the accessibility tree directly, you can only change it by the elements, roles and attributes you use.

---

### The Chrome Accessibility Tree

1. Open Chrome DevTools
2. Choose the Accessibility Tab
3. Select "Enable full-page accessibility tree
4. Choose the accessibility icon at the top right of the DOM

---

## A word of warning

It's easy to get carried away when you first discover ARIA. But there's a saying:

> No ARIA is better than bad ARIA.

---

### Pages with ARIA produce around 40% more accessibility errors than those without

This is mainly down to bad implementation. But it's also because ARIA is used to translate complex interactions. And, the more complexity you add, the more likely it is to go wrong.

---

### Use progressive enhancement

ARIA is often used in conjunction with JavaScript, but there are many [reasons why JavaScript might not load](https://kryogenix.org/code/browser/everyonehasjs.html).
 
You should always start with working native HTML and then layer the JavaScript over the top to modify the default behaviour. 

<!-- _footer: '[GOV.UK guidance on using progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)' -->

---

## The 5 rules of ARIA

They call them rules, but they're more like guidelines.

*Note: I've summarised them for the purpose of this talk*

---

### 1: Try not to use ARIA

If you can use a native element to achive the behaviour you want, then do so. Only make custom elements if you absolutely have to.

<!-- _footer: '[The first rule of ARIA](https://www.w3.org/TR/using-aria/#firstrule)' -->

---

### 2. Try not to change native semantics

Unless you *have* to, try not change native elements. Especially if you're trying to use a non-interactive element to create an interactive one.

<!-- _footer: '[The second rule of ARIA](https://www.w3.org/TR/using-aria/#secondrule)' -->

---

### 3. All interactive controls must work with a keyboard

Anything you create which you can click, tap, drag, drop, slide, or scroll must also work with a keyboard. All custom controls must be mapped to standard keystrokes.

For example, if you make a custom button using `role="button"` then make it work using both the <kbd>space</kbd> and the <kbd>enter</kbd> key, because thats how the native `<button>` element works.

<!-- _footer: '[The third rule of ARIA](https://www.w3.org/TR/using-aria/#3rdrule)' -->

---

### 4. Do not hide elements which can still be focused

Do not use `role="presentation"` or 
`aria-hidden="true"` on anything which is still interactive using a keyboard. 

*Note: aria-hidden is inherited, so this also applies to parent elements where children are still interactive*

<!-- _footer: '[The fourth rule of ARIA](https://www.w3.org/TR/using-aria/#4thrule)' -->

---

### 5. All elements must have an accessible name

An element may have a visible name, but it is only considered to have an accessible name when it is made available to assistive technology. 

<!-- _footer: '[The fifth rule of ARIA](https://www.w3.org/TR/using-aria/#fifthrule)' -->

---

## ARIA categories

There are 3 main categories.

We will cover:
- Roles
- States and properties
- Live regions

We will also look at:
- Accessible names

---

## Roles

The role is the main identity of an element and sets the expectation for assistive technology users on how it should behave. 

Custom elements should be consistent with native ones so that they are recognisable and familiar. For example, if you make it look like a button, it *must* behave like a button.

<!-- _footer: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles' -->

---

### Implicit ARIA roles

Every element has an implicit ARIA role. This means you don't usually need to assign it one, the browser will do it automatically.

Most of them are obvious:
```html
<main> <!-- role="main" -->

<button> <!-- role="button" -->

<img> <!-- role="img" -->

<img alt=""> <!-- role="presentation" -->
```

---

#### Some implicit roles are a bit weird

Some elements have roles which don't match their tags.

These are usually legacy elements which have been around since HTML was first invented. So don't always assume the pattern is always `role="<element>"`.

```html
<header> <!-- role="banner" -->

<footer> <!-- role="contentinfo" -->

<a> <!-- role="link" -->
```

---

### Presentation role

If you use `role="presentation"` then you remove that element from the accessibilty tree, but leave it visible on the page. 

This is *very similar* to `aria-hidden`, but there are differences, which we will cover later.

```html
<hr role="presentation">
```

---

### Changing a role

Any element can have its role overidden, so **it's important that the role and the visual styling match**.

```html
<a href="/buy-it-now" class="button" role="button">
  Buy it now
</a>
```

<!-- _footer: '[GOVUK start button component](https://design-system.service.gov.uk/components/button/#start-buttons)' -->

---

### Having the correct role is important

Assistive technology does not know what an element looks like, only what role it is assigned. It cannot see the elements, it just reads their properties in the Accessibility Tree.

If there is a mismatch between the visual element and the accessibility tree, it causes issues for people.

<!-- _footer: '[ARIA roles on MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)' -->
---

### Example of roles

Can be found at the following path:
```/demos/aria-roles.html```

<!-- _footer: '<a href="./demos/aria-roles.html" target="_blank">Demo of ARIA roles (Opens in a new tab)</a>' -->

---

### States and properties

The role is the main identifier for the element, and states and properties add additional context. 

There are 3 main categories:
1. Widget attributes
2. Live region attributes
3. Relationship attributes

<!-- _footer 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes' -->

---

#### There is a 4th category, but it is deprecated

The 4th category is 'Drag and drop attributes', but in the current version of ARIA both attributes are deprecated.

The attributes are:
- `aria-grabbed` - the element is currently being held by the cursor
- `aria-dropeffect` - the grabbed element has been dropped onto the target

<!-- _footer: '[GitHub issue on deprecating ARIA drag and drop attributes](https://github.com/w3c/aria/issues/1447)' -->

---

#### 1. Widget attributes

A widget attribute helps a user to understand the current state of something. For example, an element can be:
- hidden (`aria-hidden="true"`)
- pressed (`aria-pressed="true"`)
- selected (`aria-selected="true"`)
- expanded (`aria-expanded="true"`)
- collapsed (`aria-expanded="false"`)

---

##### ARIA hidden

If you use CSS to visually hide an element using `display:none` or `visibility:hidden` then it will also be hidden to assistive technology automatically.

ARIA hidden can be used to hide elements from assistive technology but still keep them visible on the page. 

```html
<hr aria-hidden="true">
```

---

##### ARIA hidden vs Presentation

`aria-hidden` and `role="presentation"` are deceptively similar in that they remove elements from the accessibility tree. The difference is in the inheritance.

`role="presentation"` will only remove the element you place it on. Whereas `aria-hidden` will also remove all of it's children.

---

##### ARIA hidden is inherited

If you use `aria-hide` a parent, then all of it's children will be hidden also.

```html
<section aria-hidden="true">
  
  <a href="/home">Home</a> <!-- aria-hidden is also true -->

</section>
```

---

##### Example of ARIA hidden and the Presentation role

Can be found at the following path:

<div>
  <code>/demos/aria-hidden-and-role-presentation.html</code>
</div>

<!-- _footer: '<a href="./demos/aria-hidden-and-role-presentation.html" target="_blank">Demo of ARIA hidden and presentation role (Opens in a new tab)</a>' -->

---

##### Example of ARIA-expanded

Can be found at the following path:
```/demos/aria-expanded.html```

<!-- _footer: '<a href="./demos/aria-expanded.html" target="_blank">Demo of ARIA expanded (Opens in a new tab)</a>' -->

---

#### 2. Live region attributes

A live region helps a user to understand what is happening in a section which has dynamic content. There are attributes you can use to let assistive technology know when it should announce changes.

For example:
- `aria-busy` - the content is still loading
- `aria-live` - inform the user if any text is added to the section
- `aria-relevant` - *supposed* to inform the user when content is removed
- `aria-atomic` - read all the content in the section again, not just the bit which changed

---

##### Do not use aria-relevant

Aria relevant is pretty broken. Voiceover and NVDA ignore it, and JAWS will just say 'Removed' with no other context.

Rather than using `aria-relevant` to track removed content, such as somebody leaving a chat session, add a line of text to a regular `aria-live` region which states what was removed.

For example:
<i>Craig Abbott has left the chat.</i>

---

##### ARIA live

ARIA live regions are necessary when you have content changing on the page away from the users focus. For example, if you receive a notification.

People who are sighted might see a notification banner pop up, or a red dot appear. Blind users will also need to be informed in a timely manner.

---

##### Different options for aria-live

ARIA live can be set to one of 3 options:
- `off` - implicit role on every element, nothing is read out
- `polite` - the screen reader will queue the changes and read them out when its finished what it is currently saying
- `assertive` - the screen reader will stop what it is saying and immediately announce the changes

---

##### Do not use assertive unless absolutely necessary

Assertive is jarring and it can be confusing. It will aggressively interrupt other information which might be important, and it increases cognitive load for the user.

Only use it in emergency situations or when there is something the user is required to do immediately. For example, if they're about to be logged out and lose unsaved work.

---

##### Alert role

If you use `role="alert"` on an element, it will automaticaly be assigned the attributes `aria-live="assertive` and `aria-atomic="true"`.

---

##### Example of ARIA-live

Can be found at the following path:
```/demos/aria-live.html```

<!-- _footer: '<a href="./demos/aria-live.html" target="_blank">Demo of ARIA live (Opens in a new tab)</a>' -->

---

#### 3. Relationship attributes

Relationship attributes help assistive technology to understand how elements work together. For example:
- `aria-controls` - attaches an interface control to another element
- `aria-labelledby` - allows you to use something else on the page as an accessible name
- `aria-describedby` - adds additional context to elements by using another element on the page

---

##### Accessible names

Under [WCAG 2.1 criterion 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html), every element needs to have an accessible name.

The accessible name is what the assistive technology reads from the tree, not what you can visually see on the page.

---

##### Using native elements

The easiest way to give something an accessible name is to use native elements.

```html
<button>Continue</button> <!-- name === 'Continue' -->

<label>
  Postcode
  <input type="text"> <!-- name === 'Postcode' -->
</label>
```

---

##### Using aria-label

You can apply an accessible name directly by using `aria-label`. But this wouldn't show visually on the page. So be careful how you use it!

Bad example:
```html
<input type="text" aria-label="Postcode">
```

Good example:
```html
<label>
  Search
  <input type="search" aria-label="Search for people, posts, or pages">
</label>
```

---

##### Using aria-labelledby

`aria-labelledby` works the same way as `aria-label`, except it uses the text from another element to create the label, rather than providing it as a string.

```html
<p>
  You will need to provide your 
  <span id="an-label">account number</span>
</p>
<input type="text" aria-labelledby="an-label">
```

---

##### Using aria-describedby

`aria-describedby` will append additional context to the label rather than acting as the label itself.

```html
<label for="an-input">
  What is your account number?
</label>
<p id="an-hint">
  Must be between 6 and 8 digits long
</p>
<input id="an-input" type="text" aria-describedby="an-hint">
```

---

##### Demo of ARIA labels

Can be found at the following path:
```/demos/aria-labels.html```

<!-- _footer: '<a href="./demos/aria-labels.html" target="_blank">Demo of ARIA labels (Opens in a new tab)</a>' -->

---

## Thank you!
Craig Abbott
Head of Accessibility, Digital
[@abbott567](https://twitter.com/abbott567)
