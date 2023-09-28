---
layout: post
title:  'Excalidraw: Add Padding Around Exported Image'
date:   '2023-09-20'
tags: [excalidraw, svg]
permalink: posts/{{ title | slugify }}.html
---

My favorite app for creating diagrams is [excalidraw](https://excalidraw.com/). It is a free, open-source, web application that has all the features necessary to quickly create almost any kind of workflow image. The user interface is terrific and easily grokked by anyone familiar with drawing apps. You can export images in either SVG or PNG formats.

There was only one thing that bothered me about the app. When images are exported, there is no padding or margins around the image, which can make them hard to work with. I wasn't the only one with the issue and someone [opened a github issue to discuss possible solutions](https://github.com/excalidraw/excalidraw/issues/1556). In the end, the issue was closed without a resolution, because there didn't seem to be a generic solution that would please everyone.

<!-- more -->

![Export image with no padding around diagram](/img/excalidraw/ss01_export_no_padding.png "Export image with no padding around diagram")

## The Workaround: Adding an Invisible Frame

My solution to this issue is similar to how I [edit SVG icons in Illustrator](https://www.kcaran.com/posts/svg-files-in-adobe-illustator.html). I add an invisible rectangle around the entire image with the amount of padding I want in the exported file.

![Adding the invisible frame](/img/excalidraw/ss02_border_frame.png "Adding the invisible frame")

The rectangle has a transparent fill and a transparent stroke to make it invisible. Even if you can't see it, it isn't difficult to select the rectangle by clicking around the border of the actual image. Once selected, the rectangle can be resized to increase or decrease the amount of padding around the image.

![Invisible frame selected](/img/excalidraw/ss03_frame_resize.png "Invisible frame selected")

Now when the image is exported, the invisible frame adds space around the image, making it immediately usable on its own or embedded in documents.

![Export image dialog with padded graphic](/img/excalidraw/ss04_export_with_padding.png "Export image dialog with padded graphic")

#### &bull; [Example PNG image with padding](/img/excalidraw/export_with_padding.png).
