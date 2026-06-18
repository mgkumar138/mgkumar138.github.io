# mgkumar138.github.io

Personal academic website of **M Ganesh Kumar, Ph.D.**  
Built with [Jekyll](https://jekyllrb.com/) + [Academic Pages](https://github.com/academicpages/academicpages.github.io) · Hosted on GitHub Pages.

---

## Repo structure

```
_config.yml          ← Site settings & author info (edit this to update sidebar)
_data/
  navigation.yml     ← Header navigation links
_pages/
  about.md           ← Home / Overview page
  publications.html  ← Full publications list
  beyond.md          ← Beyond Research page
_sass/
  theme/
    _mint_light.scss ← Color theme (crimson/cream)
  custom.scss        ← All custom styles (pub cards, tags, layout)
files/               ← PDFs: CV, paper PDFs, publication images
images/              ← Profile photo, favicons
posters/             ← Conference poster PDFs
assets/              ← JS/CSS build output (don't edit)
_includes/           ← Jekyll template partials (don't edit)
_layouts/            ← Jekyll layouts (don't edit)
Gemfile              ← Ruby dependencies (don't edit)
```

---

## How to update content

**Update bio / sidebar info** → edit `_config.yml` (author block at the top)

**Update the About page** → edit `_pages/about.md` (plain Markdown)

**Add a publication** → open `_pages/publications.html`, copy an existing `<div class="pub-card">` block and fill in the details

**Add a news item** → open `_pages/about.md`, copy a `<div class="news-item">` line

**Update Beyond Research** → edit `_pages/beyond.md` (plain Markdown + some HTML cards)

**Update navigation** → edit `_data/navigation.yml`

**Add a file (CV, poster, paper)** → drop it in `files/` or `posters/` then link from the relevant page

**Change colors** → edit `_sass/theme/_mint_light.scss` (first ~20 lines are the color variables)

---

## Local preview

```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```
