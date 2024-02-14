# Genre Expositor

> 🚨 This project is incomplete. See [Reflection](#reflection) section below

An app to determine the genre of a band/song/album.

Built with:

* [Remix](https://remix.run/)
* [Mantine](https://mantine.dev/)
* [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## Setup

1. Follow Spotify's [getting started guide](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)
2. Update .env file with your credentials

```text
cp .env.sample .env
```

## Reflection

### Background

Though I was interested in the idea of unpacking Spotify's micro-genres, this project was mainly an exploration of Remix. For those unfamiliar with the level of granularity Spotify assigns to musical genres, see [Every Noise at Once](https://everynoise.com/).

### Remix

I'm extremely impressed with Remix. As true with most libraries, I found that once I settled into the mental model (loader, actions, etc), development was fairly straight forward. I also appreciate how closely their API follows HTML standards (Kent C. Dodds has a [blog post](https://www.epicweb.dev/why-i-wont-use-nextjs) elaborating upon this).

The one limitation I found is loader/action functions can't be declared outside a route. This seems to be actively worked upon though and the work-around is minimal. There is a [discussion](https://github.com/remix-run/remix/discussions/5383) happening around this in their repo.

### Mantine

I personally think CSS-in-JS is more of a headache than anything. Plus, with React server components and the [CSS houdini project](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Houdini), it seems like CSS-in-JS is no longer as valuable and viable as it once was. In fact, Remix [explicitly recommends against](https://remix.run/docs/en/main/styling/css-in-js) using CSS-in-JS.

Mantine, on the other hand, is build around [CSS variables and modules](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Houdini) and I found it a better fit for a SSR project. the one limitation with working in CSS files is my IDE doesn't have the intelligence to know what CSS variables are available, though I believe there is a solution to this.

In comparing to [Mui](https://mui.com/), I found their TS API a little confusing. I think Mui's general developer experience is greater, but that might just come from years of personal experience with their product.
