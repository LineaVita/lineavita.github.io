---
layout: post
title: Introducing LineaVita
---

LineaVita is designed to be a tool for tracking your life activities.  The architectural design is focused on minimizing the costs of system operation so that advertising isn't required to support the system.  To this end the application stores any content on an Amazon AWS S3 bucket that is paid for by the user.  This will limit the extent that LineaVita will be adopted, and so future expansion of the application is intended to integrate with Dropbox and Google Drive that should be more broadly accessible.

The initial implementation of LineaVita is focused on collecting checkins, photos and posts about places users visit and events that they wish to track.  Later releases will integrate into a sharing server that will allow users to share content with other users.