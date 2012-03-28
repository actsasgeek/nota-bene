# Note Bene

A website written in noir. 

Note Bene 0.1.0 (Latin, "note well") is a very rough initial implementation of a "workbook" style REPL
a la Mathematic or ipython. I've shamelessly reverse engineered from ipython's notebook webapp and
www.tryclojure.org.

As of version 0.1.0, you can create, save and load workbooks but there are a lot of basic features missing
and there are quite a few advanced features I'd like to add.

## Missing Basic Features

* naming workbooks. (right now these are automatically named as "Workbook0", "Workbook1")
* downloading workbooks as .cljwb or .clj
* uploading workbooks as .cljwb or .clj
* automatic launch of webapp (clojure.java.browse?)

## Missing Advanced Features

### External
* upload assets (images, videos, etc.)
* specifying the results of computations as assets.

### Internal
* re-write client-side in ClojureScript (perhaps ClojureScript One is a model?)

## Open Questions
* is there a role for something a la live-cljs?
* is there a role for something a la "Invention by Principle" or NodeBox.

# Usage

```bash
lein deps
lein run
```

Navigate to http://localhost:8080/

# License

Copyright (C) 2011 Stephyn G. W. Butcher (actsasgeek)

Distributed under the Eclipse Public License, the same as Clojure.