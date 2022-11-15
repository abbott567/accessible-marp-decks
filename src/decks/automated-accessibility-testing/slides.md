---

title: Automated Accessibility Testing
description: Session on automated accessibility testing for National Coding Week.
paginate: true
marp: true
theme: dwp-theme

---

# Automated Accessibility Testing
Craig Abbott
Head of Accessibility, Digital
[@abbott567](https://twitter.com/abbott567)

---

## Caveat

The term 'automated' means different things to different people. 

The majority of this talk is around automated browser tools, which are not technically 'fully automated'. 

I will *try* and live code a couple of fully automated acceptance tests at the end.

---

## Why is automated testing is important?

There are around 50 criteria we need to meet in the [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/), and testing against them all is time consuming.

Using automated tools can find a lot of the common errors in a matter of seconds.

---

## Automated tools will not find everything

In an audit done by Government Digital Service (GDS), they identified that, when used in isolation:
- paid tools perform better than free ones
- the best tools only find around 40% of 142 known issues.

<!-- _footer: '[How do automated accessibility checkers compare?](https://alphagov.github.io/accessibility-tool-audit/)' -->

---

### The free tools can find around 40% of issues when combined

We use the [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?utm_source=chrome-ntp-icon), [Axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?utm_source=chrome-ntp-icon) and [Wave](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh?utm_source=chrome-ntp-icon).

They will find a lot of the same errors, but each tool has its own unique areas of expertise.

---

### Using the worlds least-accessible webpage as a benchmark

The page GDS created with 142 known issues is nicknamed '[the worlds least-accessible webpage](https://alphagov.github.io/accessibility-tool-audit/test-cases.html)'. 

When I come across new automated tools, I use this page as a benchmark to see what they can find.

<!-- _footer: '[Blog post: What we found when we tested tools on the world’s least-accessible webpage](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/)' -->

---

## In this talk

I will try to cover:
- HTML Validation using W3C and HTML-Validator-CLI
- Browser tools: Axe, ARC and Wave
- Interpreting results against WCAG 2.1
- Fully automated testing using html-validator, axe-core and pa11y

---

## Validating your HTML

Making sure your HTML is valid should always be the first step in your accessibility testing process.

If the HTML is not valid, you are far more likely to find accessibility issues.

---

### W3C Markup Validation Service

An online digital service which can validate your HTML against the HTML5 spec by:
- providing URL
- uploading a file
- direct input

---

### Demo of W3C Markup Validation Service

The demo file can be found at the following path:
```/demos/invalid.html```

The W3C Markup Validation Service can be found at the following URL:
```https://validator.w3.org/```

<!-- _footer: '[W3C Markup Validation Service](https://validator.w3.org/)' -->

---

### False positives

No automated tool is perfect. If you get a fail, there's a small posibility your code is not the problem. Look at the specifications and raise it as a bug if you think it's wrong.

---

### Demo of false positive

Use the following URL with W3C:
```https://www.craigabbott.co.uk```

You can also view:
- [The HTML5 Spec for the meta tag](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element)
- [My GitHub issue raising the bug](https://github.com/validator/validator/issues/1424)

*Note: If they fix the bug there is a chance that this demo will stop working at some point.*

<!-- _footer: '[W3C Markup Validation Service](https://validator.w3.org/)' -->

---

### HTML Validator CLI

[HTML Validator](https://www.npmjs.com/package/html-validator) is an NPM module. It is mainly used for acceptance tests in a fully automated test environment.

But you can install the [html-validator-cli](https://npmjs.com/html-validator-cli) (Command Line Interface) and run it from your terminal.

It uses the same validating engine as the W3C Markup Service, but it saves having to keep navigating to the website using a browser.

---

### Demo of HTML Validator CLI Tool

The demo file can be found at the following path:
```/demos/invalid.html```

The commands to test are:
```shell
$ html-validator --file=<path-to-file>
$ html-validator <url>
```

You can also use:
- `--verbose` to get a full readout
- `--islocal` for locally hosted websites


---

## Browser tools

Browser tools are plugins or extensions you can install to give you more functionality.

In these demos I will be using the Chrome browser with [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?utm_source=chrome-ntp-icon), [Axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?utm_source=chrome-ntp-icon) and [Wave](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh?utm_source=chrome-ntp-icon) which can be installed from the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions).

---

### Permissions

Chrome extensions can only run against URLs by default. You have to turn on an option for each one to explicitly give it access to files.

---

### Interpreting results

Each tool has its own ideas of what is an error, what is an alert, and what is best practice.

For example, ARC Toolkit says skipping a heading level is a WCAG failure, and Axe DevTools just says it's bad practice. 

*Spoiler: it is a failure. Headings need to be the correct level to pass [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html).*

<!-- _footer: '[Using h1-h6 to identify headings
](https://www.w3.org/WAI/WCAG21/Techniques/html/H42)' -->

---

## ARC Toolkit Results

**ARC Toolkit has 3 categories:**
- Errors - things it thinks is a fail
- Alerts - it's suspicious but not 100% sure if it’s a fail
- Best practices - things it thinks are not a fail but could be better

---

### Axe DevTools Results

Axe DevTools reports everything as an issue.

**It breaks fails down into 5 categories:**
- Critical
- Serious
- Moderate
- Minor

Like Axe DevTools, it also reports on best practices. Which are things it thinks are not a fail but could be better.

---

### Wave Results

**Wave reports on:**
- Errors - things it thinks are fail
- Contrast errors - things it thinks has failed specifically on colour contrast
- Alerts - it's suspicious but not 100% sure if it’s a fail

**It also reports on positive things:**
- Features - things it thinks are good and improve user experience
- Structural elements - help you assess headers etc
- ARIA - flags aria attributes

---

### Demo of browser tools

The demo file can be found at the following path:
```/demos/accessiblity-issues.html```

<!-- _footer: '<a href="./demos/accessibility-issues.html" target="_blank">Demo for browser tools (Opens in a new tab)</a>' -->

---

### Bonus browser tools

Some more useful tools are:
- [Accessibility Insights](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)
- [Broken links checker](https://chrome.google.com/webstore/detail/broken-link-checker/nibppfobembgfmejpjaaeocbogeonhch)
- [Web Developer](https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm)

---

## Fully automated testing

Because browser tools can only run on one page at a time, some people don't consider them to be automated.

---

### What can you fully automate?

The engine which runs Axe DevTools is called axe-core, and you can use this to fully automate accessibility testing.

I'm not aware of a way you can automate ARC Toolkit or Wave at this point. So, if you don't use those browser extensions you won't get access to some of those unique things they find.

---

## Recommended testing process

1. Test the HTML is valid for the page as you build it.
2. Use the browser tools against the page as you build it.
3. Run your acceptance tests against the page before you do the manual accessibility checks.
4. Manually test the page against WCAG 2.1
5. Manually test the page using assistive technologies
6. Run your acceptance tests against the whole product before merging your code.

---

## Live coding examples

This might go wrong in spectacular fashion. But I will try to live code two acceptance tests to show you how to:
- validate your HTML using HTML Validator
- run axe-core in a headless browser using PA11Y

If there's time, I'll also show you a more complex example using Selenium.

---

### Example test for HTML Validator

A basic HTML Validator test using Mocha and Chai.
```javascript
const { expect } = require('chai')
const validator = require('html-validator')

describe('Validate HTML', () => {
  it('should have valid HTML', async () => {
    const options = {
      url: 'http://localhost:3000',
      isLocal: true
    }
    const result = await validator(options)
    expect(result.messages).to.eql([])
  })
})
```

---

### Example test for PA11Y

A basic PA11Y test using Mocha and Chai.

```javascript
const { expect } = require('chai')
const pa11y = require('pa11y')

describe('PA11Y', () => {
  it('should have no accessibility issues', async () => {
    const results = await pa11y('http://localhost:3000', { runners: ['htmlcs', 'axe'] })
    expect(results.issues).to.eql([])
  })
})
```

---

### Example test for Selenium

A basic axe-core test using Mocha, Chai and Selenium.
```javascript
const AxeBuilder = require('@axe-core/webdriverjs')
const webdriver = require('selenium-webdriver')
const { expect } = require('chai')

describe('Selenium axe-core', () => {
  it('should have no violations', async () => {
    const driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build()
    await driver.get('http://localhost:3000')
    const axe = await new AxeBuilder(driver)
    const result = await axe.analyze()
    await driver.quit()
    expect(results.violations).to.eql([])
  })
})
```

---

## Thank you!
Craig Abbott
Head of Accessibility, Digital
[@abbott567](https://twitter.com/abbott567)


