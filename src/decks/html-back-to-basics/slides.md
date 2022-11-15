---

title: HTML - Back to Basics - National Coding Week
description: Session on HTML elements for National Coding Week.
paginate: true
marp: true
theme: dwp-theme

---

# HTML - Back to basics
Craig Abbott
Head of Accessibility, Digital
[@abbott567](https://twitter.com/abbott567)

---

## Did you know?

Under the Public Sector Bodies Accessibility Regulations 2018, it is illegal to push invalid HTML into a live public sector website or digital service.

<!-- _footer: '[GOV.UK Accessibility Requirements for Public Sector websites](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps)' -->

---

## The Web Content Accessibility Guidelines (WCAG) 2.1

To meet [WCAG 4.1.1 Parsing](https://www.w3.org/WAI/WCAG21/Understanding/parsing.html), your HTML code must be valid. This means it must follow the rules laid out in the specification.

---

## There's a fundamental lack of respect for HTML as a language

Because most developers can make a page *'look'* like the design, HTML and CSS are generally considered 'easy'.

---

## HTML is not studied as a specialism

In most computer science degrees, HTML is only covered in "full stack development". The entire module is usually around 100 hours and covers things like:
- design principles
- information architecture
- authentication and authorisation
- security
- standards and compliance
- *client and server-side coding*
- *usability and accessibility*

---

## HTML is flexible... Too flexible!

The following 3 examples are all *valid*.
But only one of them is *correct*.

```html
<button class="button">Continue</button>

<a class="button" href="#">Continue</a>

<div class="button">Continue</div>
```

---

### Although HTML is flexible, there are still rules!

The spec, or specification, are the rules of the language. It defines what you can and can't do.

For example, you can't just make up attributes to get your JavaScript to work, although many people do.

```html
<div moo="cow">…</div>
<script>
  div.getAttribute('moo') === 'cow'
</script>
```

<!-- _footer: '[HTML5 Spec](https://html.spec.whatwg.org/multipage/)' -->


---

## Boiler plate templates are basic

Boilerplate 'bare minimum' templates often don't even include a `<main>` element.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Boilerplate HTML</title>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <!-- Page content -->
    <script src="index.js"></script>
  </body>
</html>
```

<!-- _footer: '[HTML5 Boilerplate Example](https://html5boilerplate.com/)' -->

---

### Boilerplate templates still expect you to know HTML

Unfortunately, a lot of people who use them, do so because they're not 100% sure what then need to include.

---

## Mozilla Developer Network (MDN)

MDN combines sources such as WCAG 2.1 and the HTML5 Spec into a more user-friendly document. 

If you're ever unsure on how an element or attribute works, MDN is a really good place to look it up!

<!-- _footer: '[Mozilla Developer Network (MDN)](https://developer.mozilla.org/en-US/)' -->

---

## Before we start

If you're building digital services, you should use [GOV.UK Design System](https://design-system.service.gov.uk/) and [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/).

The components are tried and tested and are more likely to be accessible than building your own from scratch.

---

## Let's look at

- Common elements
- Headings
- Language
- Page titles
- Landmarks
- Skip links

---

## Common elements

Each HTML element has a purpose. Choosing the correct elements is the easiest way to make anything accessible.

---

### Paragraph element

A paragraph element (`<p>`) is the simplest form of structured text. It is used for anything which is basic content and should be used when the content does not fit better into another category.

```html
<p>
  A paragraph is the simplest form of meaningful content.
</p>
```

<!-- _footer: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p' -->

---

### Division element

The division element (`<div>`) is a decorative element. It is used to wrap blocks of content to give you control over the design. 

You should *never* use them for anything which is meaningful or interactive unless you modify their aria-role.

```html
<div class="half-width">
  
  <h2>Featured artists</h2>
  …

</div>
```

<!-- _footer: '[The Division element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)' -->

---

### Span element

The span (`<span>`) element is also a decorative element, but they are used inline so you can wrap parts of a sentence to add stylistic choices.

Spans should *never* be used for anything interactive or meaningful and should only be used when styles do not add context.

```html
<p>
  Only 8% of the global population has <span class="blue">blue</span> eyes.
</p>
```

<!-- _footer: '[The Span element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span)' -->

---

### Emphasis element

The emphasis (`<em>`) element should be used to emphasise certain words like you would in natural language. It should not be used simply to add italic styling.

```html
<p>
  You should <em>not</em> use the emphasis element
  just because you like the look of italics.
</p>
```

<!-- _footer: '[The Emphasis element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em)' -->

---

### Strong importance element

The strong importance element (`<strong>`) should only be used for urgent or important information, such as a warning. 

It should *not* be used just to make something bold.

```html
<strong>
  Warning! You can be fined up to £5,000 if you do not register.
</strong>
```

<!-- _footer: '[The Strong Importance element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)' -->

---

### Idiomatic text element

It idiomatic text element (`<i>`) should be used for text with a different semantic meaning to the surrounding text.

For example:
- an alternative voice or mood
- alternative languages or translations
- technical terms
- written thoughts


<!-- _footer: '[The Idiomatic Text element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)' -->


---

### Image element

Images (`<img>`) are for visual content. You *must* give them an alt text attribute. The alt text should describe the image or be left blank if the image is decorative.

```html
<img src="cat.jpg" alt="A tabby cat wearing sunglasses.">

<img src="background.jpg" alt="">
```

<!-- _footer: '[The Image element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)' -->

---

### Unordered list element

Use an unordered list when the reading order doesn't matter.

```html
<p>
  To open a bank account, you need:
</p>

<ul>
  <li>proof of address</li>
  <li>a valid ID document</li>
  <li>a minimum deposit of £1</li>
</ul>
```

<!-- _footer: '[The Unordered List element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)' -->

---

### Ordered list element

Use ordered lists where the order matters for context.

For example, a step-by-step process.

```html
<p>Complete the following steps:</p>

<ol>
  <li>Step 1: Go online</li>
  <li>Step 2: Book your tickets</li>
  <li>Step 3: Pick up your tickets when you arrive</li>
</ol>
```

<!-- _footer: '[The Ordered List element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)' -->

---

### Anchor element

An anchor element (`<a>`), more commonly known as a hyperlink, is used to link the user to other parts of the page, other parts of the site, or other parts of the internet.

```html
<a href="#main-content">Skip to main content</a>

<a href="/contact-us">Contact us</a>

<a href="https://gov.uk">GOV.UK</a>
```

<!-- _footer: '[The Anchor element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)' -->

---

### Line break elements

Line breaks are used to force text onto a new line. They should *not* be used to create whitespace on a page. 

<div class="row">
  <div class="col">

Good example:
```html
<p>
  Mr Sherlock Holmes<br>
  221B Baker Street,<br>
  London<br>
  NW1 6XE
</p>
```
  </div>
  <div class="col">

Bad example:
```html
<section id="section-1">…</section>
<br>
<br>
<br>
<br>
<section id="section-2">…</section>
```

  </div>
</div>

<!-- _footer: '[The Linebreak element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br)' -->

---

### Thematic break element

A thematic break element was historically called a horizontal rule. Which is why it uses the tag `<hr>`.

You should avoid using these as they are not implemented consistently and if you structure your content properly, they are not needed. 

If you need to create a visual horizontal rule, use CSS instead.

<!-- _footer: '[The Thematic break element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)' -->

---

## Heading element

Heading elements (`<h1>` to `<h6>`) need to be the marked up correctly, be the right level, and be easy to understand.

---

### Marking up headings

You can't just make the font look big and bold.

```html
<h1>
  This will behave like a heading
</h1>

<p class="large bold">
  This may look like a heading, but it will not behave like one.
</p>
```

---

### Heading levels

There are 6 levels. Realistically, if you need more than 3 or 4, your page is probably too complex!
```html
<h1>Heading Level 1</h1>
<h2>Heading Level 2</h2>
<h3>Heading Level 3</h3>
<h4>Heading Level 4</h4>
<h5>Heading Level 5</h5>
<h6>Heading Level 6</h6>
```

---

#### Headings should be related

If you have a `<h3>` and it does not relate to the `<h2>` or `<h1>` above it, then you've usually done something wrong. 

```html
<h1>COVID-19</h1>

  <h2>How to stay safe</h2>
    <h3>Wearing a mask</h3>
    <h3>Washing your hands</h3>
    <h3>Social distancing</h3>

  <h2>How to get tested</h2>
    <h3>Getting tested if you're a key worker</h3>
    <h3>Getting a test for somebody in a care home</h3>
```

---

#### Don't use the wrong heading level for stylistic purposes

```html
<h1>
  I want this text to be large
</h1>

<h5>
  I want this text to be small
</h5>
```

---

#### If you need to make headings smaller, use CSS

```html
<h1 class="heading-large">
  I want this text to be large
</h1>

<h2 class="heading-small">
  I want this text to be small
</h2>
```

```css
.heading-large { font-size: 2rem; }
.heading-small { font-size: .5rem; }
```

---

#### Demo of heading-levels

Can be found at the following path:
```/demos/heading-levels.html```

<!-- _footer: '<a href="./demos/heading-levels.html" target="_blank">Demo of heading levels (Opens in a new tab)</a>' -->

---

## Language attribute

The language attribute (`lang`) must be set on each page so that assistive technologies such as screen readers pronounce the words correctly.

It must also be set on any blocks which use a different language to the rest of the page.

---

### Setting the language of the page

Using the `lang` attribute on the `HTML` element lets assistive technologies know the content on this page is written in English.

```html
<!DOCTYPE html>
<html lang="en">
```

<!-- _footer: '[The Lang attribute on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)' -->

---

### Language inheritance

Nested children inherit the same language as their parents. So, you don't need to specify it on every element, just on the outer most container.

```html
<html lang="en"> 
  …
  <body>
    <p>
      This paragraph inherits English from the body element,
      and the body element inherits English from the HTML element.
    </p>
  </body>
</html>
```

---

### Setting the language for a block

For anything that should *not* inherit from the page language, you need to add the lang attribute separately. 

```html
<html lang="en">
  …
  <body>
    <h1>This heading is in English</h1>
    <p>
      This paragraph is also in English.
    </p>
    <p lang="fr">
      Ce paragraphe est en Français
    </p>
  </body>
</html>
```

---

### Two languages in the same block

You can mix multiple languages in a block by using an idiomatic text element (`<i>`).

Don't use a `<span>` or it might not work. Remember, they are purely decorative.

```html
<html lang="en">
  <body>
    <p>
      Sometimes people mix languages in a paragraph, 
      but they don't apply the correct language attributes. 
      <i lang="fr">Ç'est la vie!</i>
    </p>
  </body>
</html>
```

---

### Example of linking to Welsh

You may have a link on a service to translate it to Welsh.

```html
<html lang="en">
  <body>
    <h1>Apply for a passport</h1>

    <a href="/welsh" lang="cy">
      Mae'r dudalen hon ar gael yn Gymraeg
    </a>

    …
  </body>
</html>
```

---

### Example of linking to English

On the Welsh language version, you would need to tag the English in the same way.

```html
<html lang="cy">
  <body>
    <h1>Gwneud cais am basbort</h1>

    <a href="/english" lang="en">
      This page is available in English.
    </a>

    …
  </body>
</html>
```

---

### Demo of language attribute

Can be found at the following path:
```/demos/language-attributes.html```

<!-- _footer: '<a href="./demos/language-attributes.html" target="_blank">Demo of language attributes (Opens in a new tab)</a>' -->

---

## Page title element

Each page needs to have a unique and descriptive title so users can orientate themselves quickly and find content. It should tell them what page they're on, and what website or service they're on. 

```html
<title>
  What is your name? - Apply for Universal Credit - GOV.UK
</title>
```
or
```html
<title>
  Tools and resources - DWP Accessibility Manual
</title>
```

---

### Setting the page title

The title element is used inside the `<head>` element on your page. 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <title>Report a sighting of an excellent cow - GOV.UK</title>
  </head>
  …
</html>
```

---

## Landmarks

Landmarks break the page down into defined areas, which helps people using assistive technology find content easier.

---

### Landmark types
- Main
- Header
- Footer
- Navigation
- Form
- Aside
- Region
- Section
- Search

<!-- _footer: '[The Landmark Role on MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role)' -->

---

### Basic page structure

Most basic pages are made up of:
- Header
- Page content
- Footer

---

### Header

The header is usually consistent at the top of each page. It will usually contain a logo and maybe a navigation menu.

```html
<header>
  <img src="logo.png" alt="Craig Abbott Logo">
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about-us">About us</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
```

<!-- _footer: '[The Header Role on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header)' -->

---

### Footer

Like the header, the footer is usually consistent at the bottom of each page. It usually contains useful links and copyright information.

```html
<footer>
  <h2>Support links</h2>
  <ul>
    <li><a href="/accessibility">Accessibility</a></li>
    <li><a href="/cookies">Cookies</a></li>
    <li><a href="/privacy">Privacy</a></li>
  </ul>
  <p>
    © Craig Abbott. All rights reserved.
  </p>
</footer>
```

<!-- _footer: '[The Footer Role on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)' -->

---


### The main landmark

The `<main>` element is where you put the important stuff. There should only be 1 on each page.

A `<h1>` should describe the content in it, and it should always have an ID to use a skip-link for bypass blocks.

```html
<main id="main-content">
  <h1>
    A heading to describe the content
  </h1>  
  <!-- The content -->
</main>
```

<!-- _footer: '[The Main Landmark on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main)' -->

---

### Demo of landmarks

Can be found at the following path:
```/demos/landmarks.html```

<!-- _footer: '<a href="./demos/landmarks.html" target="_blank">Demo of landmarks (Opens in a new tab)</a>' -->

---

## Main skip-link

A skip-link should always be provided at the top of each page so that keyboard users can quickly get to the content they need.

```html
<body>
  <a href="#main-content">Skip to main content</a>
  …
  <main id="main-content">
  …
</body>
```

---

### Additional skip links

You might need additional skip links if you have other blocks of repeated content. Such as a social media feed in a sidebar.

```html
<a href="#contact-details">Skip Twitter feed</a>

<div id="twitter-feed">
  <a class="twitter-timeline" href="https://twitter.com/abbott567">
    Tweets by @abbott567
  </a> 
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

<h2 id="contact-details">Contact details</h2>
```

---

### But skip links look ugly!

They don't need to be visible all the time. They can be hidden and only visible when they receive keyboard focus.

<div class="row">
  <div class="col">

Not focused:
```css
.skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
```

  </div>

  <div class="col">

Focused:
```css
.skip-link:focus {
  position: static;
  width: auto;
  height: auto;
  margin: inherit;
  overflow: visible;
  clip: auto;
}
```

  </div>
</div>

---

### Demo of skip-link

Can be found at the following path:
```/demos/skip-link.html```

<!-- _footer: '<a href="./demos/skip-link.html" target="_blank">Demo of skip link (Opens in a new tab)</a>' -->

---

## Form elements

There are important elements such as `<form>`, `<button>`, `<input>` and `<label>` which are being covered in a separate session tomorrow.

<!-- _footer: '[Sign up for session on forms](https://www.eventbrite.com/e/national-coding-week-forms-tickets-396944821647)' -->

---

## Thank you!
Craig Abbott
Head of Accessibility, Digital
[@abbott567](https://twitter.com/abbott567)
