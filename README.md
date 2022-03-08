# Bsale_Front_Doc

La implementación  del cliente que consume la API-REST de django-rest es mediante [Vanilla js](https://platzi.com/fundamentos-javascript-2017/tutoriales/que-es-vanilla-js-o-javascript-puro/) considerando el uso de librerias Jquery ajax, popper.js, bootstrap, HTML, y CSS  Buscador implementado, categorización, paginación y orden. Manejo de errores 404 y 500

## Link hacia la app

[Desafio Bsale](https://hungry-mahavira-07b641.netlify.app/)

Links de la Api

`{
"products": "[https://testapibsale.herokuapp.com/products/?format=api](https://testapibsale.herokuapp.com/products/?format=api)",
"groups": "[https://testapibsale.herokuapp.com/categories/?format=api](https://testapibsale.herokuapp.com/categories/?format=api)",
"categories": "[https://testapibsale.herokuapp.com/categories/?format=api](https://testapibsale.herokuapp.com/categories/?format=api)"
}`

### Al clonar el repositorio y antes de inicializar la REST-API es MUY IMPORTANTE

---

<aside>
🖥️ 🚨 Eliminar el archivo **bs-config.js este forma parte del deploy en remoto**

</aside>

<aside>
🖥️ 🚨 Cambiar en el archivo `scripts.js`la variable `base_URL` que vendrá con el valor del deploy.
Se debe colocar en su lugar  “[http://127.0.0.1:8000/”](http://127.0.0.1:8000/%E2%80%9D)

</aside>

Notion 

[Bsale_Front_Doc](https://www.notion.so/Bsale_Front_Doc-d89edb92b5f44c9588e507218c01ea24)