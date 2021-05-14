---
date: 2021-05-14T14:50
---
# Example References

[[z:zettels?tag=example-reference]]#

## Reference Formats

References are specified with the `reference` field in the page's metadata.
Using this field should be thought of as making the page "own" that particular reference: the page can be seen as synonymous with the reference, in the context of your collection of notes.

The input format can be anything which [citation-js](https://citation.js.org) knows how to interpret.
Therefore the reference can be any of the following:

- bibtex (as above)
- bibJSON
- CFF
- CSL JSON
- DOI
- ISBN
- wikidata

As you can see, reference data can be specified completely locally, but can also be specified _externally_ via DOI, ISBN, wikidata etc..
This tool was built with local referencing in mind, but for example: maybe you have a page dedicated to notes about a paper, you can use its DOI in the `reference` field, and [citation-js](https://citation.js.org) will fetch everything it needs about that paper.

For example, this is a citation generated from an external location:

<cite label="10.1093/ajae/aaq063">[[9743c64f]]#</cite>

And this was produced by using the DOI as the citation label:

```html
<cite label="10.1093/ajae/aaq063">[[9743c64f]]#</cite>
```
