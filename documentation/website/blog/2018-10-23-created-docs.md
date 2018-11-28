---
title: 10/23/18 Decide On and Implement a Documentation Tool
author: Jordan Carroll
authorURL: http://twitter.com/AJordanCarroll
---

This is the first blog entry for the documentation for the Monorepo Boilerplate project that is currently in development. My first decision in creating the project is to start by outlining different documentation tools and deciding on which to move forward with. 

## The Options

After some initial research, it seems like there are quite a few good documentation tools out there that could meet our needs. The table below outlines the different tools and their benefits and considerations for our use case.


<table>
  <tbody>
    <tr>
      <th>Tool Name</th>
      <th>Benefits</th>
      <th>Considerations</th>
    </tr>
    <tr>
      <td>Gitbook ⭐</td>
      <td>
        <ul>
          <li>Mature product</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Poor support</li>
          <li>Focusing primarily on supporting paying customers - even then support is spotty</li>
          <li><a href="https://github.com/reduxjs/redux/issues/3161" style="color: #3193ff;">Redux is investigating alternatives</a> for their documentation (they currently use gitbook)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>docsify ⭐⭐</td>
      <td>
        <ul>
          <li>Doesn't require a build process - pure static implementation</li>
          <li>Very simple configuration</li>
        </ul>
      </td>
      <td>
        <ul>
          <li></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>docz ⭐⭐</td>
      <td>
        <ul>
          <li>declarative routing makes configuration very easy - routing is defined in the docs files themselves</li>
          <li>The most minimal setup of all options</li>
          <li>Allows for very easy use of react components in .mdx files</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Small weird issues that haven't been addressed (i.e. not great product support)</li>
          <li>Lacking full featured search functionality</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>docusaurus ⭐⭐⭐</td>
      <td>
        <ul>
          <li>Supported by facebook</li>
          <li>Highly configurable</li>
          <li>Powerful algolia search (requires hosted site for the site crawler)</li>
          <li>Built with React and allows custom pages</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Highly configurable</li>
          <li>non-trivial directory structure and large number of required files</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Gatsby ⭐⭐⭐⭐</td>
      <td> <i>I did not officially consider Gatsby. It would be a great candidate if we needed that level of configurability and customization, but it seemed like overkill.</i></td>
      <td>--</td>
    </tr>
  </tbody>
</table>

## The Verdict - Docusaurus

When I finally got into the weeds with the different tools they started to show their true colors. I wanted to like `docz` the most but it ended up having issues that I felt like warranted caution in proceding with use. (See the considerations for `docz` above). My second choice was `docusaurus` largely for the powerful support community of `Facebook` and it turned out not to disapoint. It's easy to set up and use and allows for great customization, but isolates it when it's unecessary. 
