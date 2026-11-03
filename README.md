<img src="https://raw.githubusercontent.com/react-boilerplate/react-boilerplate-brand/master/assets/banner-metal-optimized.jpg" alt="react boilerplate banner" align="center" />

<br />

<div align="center"><strong>Start your next react project in seconds</strong></div>
<div align="center">A highly scalable, offline-first foundation with the best DX and a focus on performance and best practices</div>

<br />

<div align="center">
  <!-- Dependency Status -->
  <a href="https://david-dm.org/react-boilerplate/react-boilerplate">
    <img src="https://david-dm.org/react-boilerplate/react-boilerplate.svg" alt="Dependency Status" />
  </a>
  <!-- devDependency Status -->
  <a href="https://david-dm.org/react-boilerplate/react-boilerplate#info=devDependencies">
    <img src="https://david-dm.org/react-boilerplate/react-boilerplate/dev-status.svg" alt="devDependency Status" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/react-boilerplate/react-boilerplate">
    <img src="https://travis-ci.org/react-boilerplate/react-boilerplate.svg" alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/react-boilerplate/react-boilerplate">
    <img src="https://coveralls.io/repos/github/react-boilerplate/react-boilerplate/badge.svg" alt="Test Coverage" />
  </a>
  <a href="https://spectrum.chat/react-boilerplate">
  <img alt="Chat with us on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a>

</div>
<div align="center">
    <!-- Backers -->
  <a href="#backers">
    <img src="https://opencollective.com/react-boilerplate/backers/badge.svg" alt="Backers" />
  </a>
      <!-- Sponsors -->
  <a href="#sponsors">
    <img src="https://opencollective.com/react-boilerplate/sponsors/badge.svg" alt="Sponsors" />
  </a>
  <a href="http://thinkmill.com.au/?utm_source=github&utm_medium=badge&utm_campaign=react-boilerplate">
    <img alt="Supported by Thinkmill" src="https://thinkmill.github.io/badge/heart.svg" />
  </a>
</div>

<br />

<div align="center">
  <sub>Created by <a href="https://twitter.com/mxstbr">Max Stoiber</a> and maintained with ❤️ by an amazing <a href="https://github.com/orgs/react-boilerplate/people">team of developers</a>.</sub>
</div>

## Local validation

Use Node.js 22 or 24 and install dependencies with `npm ci --legacy-peer-deps`.
Run `npm test -- --runInBand --watch=false` for lint, tests, and coverage, and
`npm run build` for the production bundle. CI runs both commands on pull requests.

The development server uses webpack-dev-middleware 7 with Webpack 5 and retains
webpack-hot-middleware for HMR. Production still emits hashed chunks, gzip assets,
PWA icons, and offline caches. The Webpack 5-compatible `@lcdp/offline-plugin`
fork retains runtime registration and optional AppCache support (disabled by
default upstream). Webpack's generated runtime still targets ES5.

Image optimization uses image-minimizer-webpack-plugin with Sharp for PNG and
animated GIF, and SVGO for SVG. JPEG remains unmodified, as before. Webpack
asset modules retain the 10 kB inline threshold. Sharp also generates the same
Android/iOS PWA icon dimensions, with content-hashed filenames and manifest/Apple
HTML tags, without the obsolete Jimp/archive-download toolchain.

The test runner is Jest 30 with an explicit jsdom environment, Babel 7, the
React-16-compatible Testing Library 12 API (aliased to preserve existing imports),
and the original snapshot formatting and coverage thresholds. One shallow
snapshot now prints the existing ForwardRef display name (`App__AppWrapper`),
as Jest 30's serializer does; the rendered structure is unchanged. ESLint 8 retains
the existing Airbnb rule set; its resolver now resolves Node modules and `app`
directly instead of importing obsolete browser crypto shims.

Stylelint's newer value checks caught `align-items: space-between`, which browsers
ignore. Removing that ineffective declaration preserves layout; two snapshots
only change the resulting styled-components class hash. Other snapshot edits are
Jest's documentation-link header migration.

Small API bridges in `internals/compat` delegate legacy matching to minimatch 11
and Jest configuration merging to deepmerge-ts 8. They do not retain the
vulnerable implementations. Regression tests exercise
their actual consumer APIs, including Glob 7's pattern metadata. `.npmrc` packs
these local dependencies for portable clean installs. Coveralls uses the
maintained `coveralls-next` client under the existing command name.

The offline plugin uses patched loader-utils 2.0.4 directly, pinned by a scoped
override. This version retains the plugin's hashing, query parsing and request
stringification APIs; no offline loader-utils bridge is needed. Its actual
consumer resolution was verified after clean locked installs, and the offline
integration test compiles and executes the generated worker registration and
AppCache fallback.

Run `npm audit --package-lock-only` to audit every runtime, development, and
optional dependency. CI fails on any severity or registry error; no audit
exclusions are configured.

This toolchain migration also retains the coordinated router/Immutable repair:
connected-react-router 6.9.3 and Immutable 4.3.9, with no vulnerable Immutable 3
fallback in the dependency tree.

SVG validation and optimizer compatibility, PNG transparency, and GIF animation
are tested without the old SVG-detection/XML-parser dependency chain.

The offline plugin wrapper normalizes generated URLs on Windows. The offline
integration test compiles and executes both service-worker registration and the
opt-in AppCache fallback, without enabling AppCache in the application by default.

The optional public development tunnel has been removed. Use `npm start` for
local/LAN development; production hosting and server binding are unchanged.

webpack-hot-middleware 2.26.1 keeps HMR event streams open on Node.js 22 and 24.

## Features

<dl>
  <dt>Quick scaffolding</dt>
  <dd>Create components, containers, routes, selectors and sagas - and their tests - right from the CLI!</dd>

  <dt>Instant feedback</dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes to the CSS and JS are reflected instantaneously without refreshing the page. Preserve application state even when you update something in the underlying code!</dd>

  <dt>Predictable state management</dt>
  <dd>Unidirectional data flow allows for change logging and time travel debugging.</dd>

  <dt>Next generation JavaScript</dt>
  <dd>Use template strings, object destructuring, arrow functions, JSX syntax and more.</dd>

  <dt>Next generation CSS</dt>
  <dd>Write composable CSS that's co-located with your components for complete modularity. Unique generated class names keep the specificity low while eliminating style clashes. Ship only the styles that are on the page for the best performance.</dd>

  <dt>Industry-standard routing</dt>
  <dd>It's natural to want to add pages (e.g. `/about`) to your application, and routing makes this possible.</dd>

  <dt>Industry-standard i18n internationalization support</dt>
  <dd>Scalable apps need to support multiple languages, easily add and support multiple languages with `react-intl`.</dd>

  <dt>Offline-first</dt>
  <dd>The next frontier in performant web apps: availability without a network connection from the instant your users load the app.</dd>

  <dt>Static code analysis</dt>
  <dd>Focus on writing new features without worrying about formatting or code quality. With the right editor setup, your code will automatically be formatted and linted as you work.</dd>

  <dt>SEO</dt>
  <dd>We support SEO (document head tags management) for search engines that support indexing of JavaScript content. (eg. Google)</dd>
</dl>

But wait... there's more!

- _The best test setup:_ Automatically guarantee code quality and non-breaking
  changes. (Seen a react app with 100% test coverage before?)
- _Native web app:_ Your app's new home? The home screen of your users' phones.
- _The fastest fonts:_ Say goodbye to vacant text.
- _Stay fast_: Profile your app's performance from the comfort of your command
  line!
- _Catch problems:_ AppVeyor and TravisCI setups included by default, so your
  tests get run automatically on Windows and Unix.

There’s also a <a href="https://vimeo.com/168648012">fantastic video</a> on how to structure your React.js apps with scalability in mind. It provides rationale for the majority of boilerplate's design decisions.

<sub><i>Keywords: React.js, Redux, Hot Reloading, ESNext, Babel, react-router, Offline First, ServiceWorker, `styled-components`, redux-saga, FontFaceObserver</i></sub>

## Quick start

1.  Make sure that you have Node.js 22 or 24 installed.
2.  Clone this repo using `git clone --depth=1 https://github.com/react-boilerplate/react-boilerplate.git <YOUR_PROJECT_NAME>`
3.  Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.<br />
4.  Run `npm run setup` in order to install dependencies and clean the git repo.<br />
    _At this point you can run `npm start` to see the example app at `http://localhost:3000`._
5.  Run `npm run clean` to delete the example app.

Now you're ready to rumble!

> Please note that this boilerplate is **production-ready and not meant for beginners**! If you're just starting out with react or redux, please refer to https://github.com/petehunt/react-howto instead. If you want a solid, battle-tested base to build your next product upon and have some experience with react, this is the perfect start for you.

## Documentation

- [**The Hitchhiker's Guide to `react-boilerplate`**](docs/general/introduction.md): An introduction for newcomers to this boilerplate.
- [Overview](docs/general): A short overview of the included tools
- [**Commands**](docs/general/commands.md): Getting the most out of this boilerplate
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.
- [**Troubleshooting**](docs/general/gotchas.md): Solutions to common problems faced by developers.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://mxstbr.com"><img src="https://avatars0.githubusercontent.com/u/7525670?v=4" width="80px;" alt="Max Stoiber"/><br /><sub><b>Max Stoiber</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=mxstbr" title="Code">💻</a> <a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=mxstbr" title="Documentation">📖</a> <a href="#ideas-mxstbr" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-mxstbr" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=mxstbr" title="Tests">⚠️</a></td><td align="center"><a href="https://julien.engineering/"><img src="https://avatars2.githubusercontent.com/u/8948127?v=4" width="80px;" alt="Julien Benchetrit"/><br /><sub><b>Julien Benchetrit</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=julienben" title="Code">💻</a> <a href="#question-julienben" title="Answering Questions">💬</a> <a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=julienben" title="Documentation">📖</a> <a href="#review-julienben" title="Reviewed Pull Requests">👀</a> <a href="#maintenance-julienben" title="Maintenance">🚧</a></td><td align="center"><a href="http://sarafederi.co"><img src="https://avatars1.githubusercontent.com/u/15176096?v=4" width="80px;" alt="Sara Federico"/><br /><sub><b>Sara Federico</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=gretzky" title="Code">💻</a> <a href="#review-gretzky" title="Reviewed Pull Requests">👀</a> <a href="#question-gretzky" title="Answering Questions">💬</a> <a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=gretzky" title="Documentation">📖</a> <a href="#maintenance-gretzky" title="Maintenance">🚧</a></td><td align="center"><a href="https://justingreenberg.com"><img src="https://avatars1.githubusercontent.com/u/1539088?v=4" width="80px;" alt="Justin Greenberg"/><br /><sub><b>Justin Greenberg</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=justingreenberg" title="Code">💻</a> <a href="#review-justingreenberg" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/jwinn"><img src="https://avatars3.githubusercontent.com/u/891726?v=4" width="80px;" alt="Jon Winn"/><br /><sub><b>Jon Winn</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=jwinn" title="Code">💻</a> <a href="#review-jwinn" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://meester-johan.info/"><img src="https://avatars2.githubusercontent.com/u/474743?v=4" width="80px;" alt="Johan Meester"/><br /><sub><b>Johan Meester</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=Mensae" title="Code">💻</a> <a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=Mensae" title="Tests">⚠️</a> <a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=Mensae" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/Dattaya"><img src="https://avatars3.githubusercontent.com/u/387256?v=4" width="80px;" alt="Yaroslav Kiliba"/><br /><sub><b>Yaroslav Kiliba</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=Dattaya" title="Code">💻</a></td><td align="center"><a href="https://github.com/gihrig"><img src="https://avatars2.githubusercontent.com/u/1481063?v=4" width="80px;" alt="Glen Ihrig"/><br /><sub><b>Glen Ihrig</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=gihrig" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://github.com/somus"><img src="https://avatars3.githubusercontent.com/u/1802828?v=4" width="80px;" alt="Somasundaram Ayyappan"/><br /><sub><b>Somasundaram Ayyappan</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=somus" title="Code">💻</a></td><td align="center"><a href="https://www.codedsignal.co.uk/"><img src="https://avatars0.githubusercontent.com/u/21795?v=4" width="80px;" alt="Oliver Turner"/><br /><sub><b>Oliver Turner</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=oliverturner" title="Code">💻</a></td><td align="center"><a href="https://github.com/samit4me"><img src="https://avatars3.githubusercontent.com/u/3248531?v=4" width="80px;" alt="Samuel Sharpe"/><br /><sub><b>Samuel Sharpe</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=samit4me" title="Code">💻</a></td><td align="center"><a href="https://karandikarmihir.github.io/"><img src="https://avatars3.githubusercontent.com/u/17466938?v=4" width="80px;" alt="Mihir Karandikar"/><br /><sub><b>Mihir Karandikar</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=KarandikarMihir" title="Code">💻</a></td><td align="center"><a href="http://www.vverma.net"><img src="https://avatars2.githubusercontent.com/u/627846?v=4" width="80px;" alt="Vaibhav Verma"/><br /><sub><b>Vaibhav Verma</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=v" title="Code">💻</a></td><td align="center"><a href="https://imagineclarity.com"><img src="https://avatars1.githubusercontent.com/u/4217871?v=4" width="80px;" alt="Sébastien Dubois"/><br /><sub><b>Sébastien Dubois</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=sedubois" title="Code">💻</a></td><td align="center"><a href="https://www.chaintng.com"><img src="https://avatars2.githubusercontent.com/u/2979072?v=4" width="80px;" alt="Chainarong Tangsurakit"/><br /><sub><b>Chainarong Tangsurakit</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=chaintng" title="Code">💻</a></td><td align="center"><a href="https://amilajack.com"><img src="https://avatars1.githubusercontent.com/u/6374832?v=4" width="80px;" alt="Amila Welihinda"/><br /><sub><b>Amila Welihinda</b></sub></a><br /><a href="https://github.com/react-boilerplate/react-boilerplate/commits?author=amilajack" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## Supporters

This project would not be possible without the support of these amazing folks. [**Become a sponsor**](https://opencollective.com/react-boilerplate) to get your company in front of thousands of engaged react developers and help us out!

<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/0/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/1/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/2/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/3/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/4/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/5/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/6/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/7/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/8/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/bronze-sponsor/9/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/bronze-sponsor/9/avatar.svg"></a>

---

<a href="https://opencollective.com/react-boilerplate/backer/0/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/1/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/2/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/3/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/4/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/5/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/6/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/7/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/8/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/react-boilerplate/backer/9/website" target="_blank"><img src="https://opencollective.com/react-boilerplate/backer/9/avatar.svg"></a>

## License

This project is licensed under the MIT license, Copyright (c) 2019 Maximilian
Stoiber. For more information see `LICENSE.md`.
