# Neuron Citation

An experimental tool for adding citations to [neuron](https://github.com/srid/neuron).

**Note**: this requires neuron version `1.9.29.0` or later.

See [this project's github pages](https://samwalls.github.io/neuron-citation/) for a set of working examples.

## Installation

In order to use this, first add the following to [`head.html`](https://neuron.zettel.page/custom-head) in your neuron notes directory.

```
<!-- citation.js -->
<script src="https://cdn.jsdelivr.net/npm/citation-js@0.5.1"></script>
```

And then clone this repo into your notes (or add it as a submodule), ideally into `static`.
Then add the following to `head.html`:
```
<!-- citation transformer -->
<script src="./static/neuron-citation/citation-transformer.js" type="module"></script>
```

## Usage

### Building References

Each zettelkasten may now include a `reference` section to its YAML frontmatter, like so:

`test.md`
```yaml
...
reference: >
  @book{MyLabel,
    author = {Blogs, Joe},
    year = {2021},
    title = {My Book},
  }
...
```

Any reference format which is supported by [citation-js](https://citation.js.org) by default is supported in this field.
This was intended for making zettel pages which are intrinsically linked to local citation data, however one can also use links to external locations.

For example, one could use a doi as the reference:

```
reference: 10.1093/ajae/aaq063
```

Or, one could use a wikilink:
```
reference: https://www.wikidata.org/wiki/Q21972834
```

I've not tried out many external citations, so this might break somehow.

### Making Citations

Currently this tool works by replacing `<cite>` elements in the page.

If you have the following In your markdown:
```
Lorem ipsum dolor sit amet.

<cite label="MyLabel">[[my-slug]]#</cite>
```
(Note the use of the zettelkasten link _within_ the citation, this will also preserve folgezettel links within neuron),

This will be essentially transformed into text which looks like the following:

>Lorem ipsum dolor sit amet.
>
>Blogs, J. (2021). My Book.

Where the displayed APA citation also acts as a hyperlink to the zettel page, as before.

---

This tool is very new and I have a lot of plans for it, including:

- [ ] use browserify, or something similar, to make project management easier
- [ ] add control over citation-js output types (APA, harvard, or even raw bibtex)
  - [ ] make it so that bibtex output is in a code block, and has a button to copy to clipboard
- [ ] add different citation types (e.g. like biblatex's `\citeauthor`)
  - [ ] make it easy for one to define their own citation types
- [ ] make it so that the zettel page id/slug can be optionally used instead of a citation label (in this case we would use the first reference data we find in the page's metadata as the citation)
- [ ] more convenient syntax
- [ ] add a `<bibliography>` (or something like that) which shows all citations made on the page up to that point
- [ ] fully-fledged neuron plugin/integration which allows citations to automatically create folgezettel links if desired
  - [ ] there may also be some interesting use-cases for tags?
