# TEA.co

This is an ecommerce website built with Django and React, styled with SemanticUI, and backed with a REST API and Stripe payments.
The site is deployed via Heroku at: https://tea-ware.herokuapp.com.

I wrote the site to practice the Django/React stack.

It turns out one of the bigger challenges was getting it deployed to Heroku.

_Lesson Learned:_ implement the deployment process as early as possible!

DEMO:
![Demo](public/static/images/TEA.gif)

## Directory Layout

- `core`: Django application
- `home`: Django project directory
- `media`: Product images
- `public`: Static resources
- `src`: React application

## Access Control

- Ecommence and Profile work after login.
- Stripe payment card is rendered when both shipping and billing adresses are present.
- Some products may come with variations that _must_ be select them before they can be added to the cart.

## Potential Improvements

- There's a bug on navbar loading (Nav component does not remount after login or signup as Nav is outsite routes. try refresh the page).
- Responsive design.
- Create a CI/CD pipeline.
