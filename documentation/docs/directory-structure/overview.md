---
id: directory-structure-overview
title: Overview
---

The section of the docs gives a detailed overview of the major sub-directories in the Monorepo Boilterplate root directory. 

## ~/ (root)
The root directory of the project will contain high level configuration files that pertain to the monorepo as a whole (and not individual packages).

## ~/apps/

An app is simply an application that may be a composition of other packages in the monorepo that target a specific deployment environment. We have two major use-cases for housing multiple applications in a single repository at PureCars.

**Apps that target different devices**

Our first use-case we ran across was that we needed to create multiple applications for different target devices. We needed to have a native application, a mobile web app, and a separated desktop web application and all of these apps needed to have access to several core packages.

**Suite of Apps**

One of our products began its life as a single responsive web application but quickly outgrew itself and spawned into multiple products in a suite of apps. Think of it like the google suit of products. While using gmail, you can click the apps icon at the top and quickly change context to your calendar, or google+ (RIP), or youtube. This is what we mean by a suite of apps. In our use-case, many of our apps would use very similar core logic and even components.

## ~/components/

The components directory is expected to contain sub-directories that will be individual packages and represnt code related to a specific component. On occasion it might make sense for multiple variants of that same component to be exported from that package.

## ~/services/

The services directory should contain deployable web services. An example of this is a firebase hosted function. 

## ~/packages/

A package is a shared js module that can be used in other packages.

## ~/documentation/

The documentation directory. See [documentation intro](documentation-intro.md) for more information on this.
