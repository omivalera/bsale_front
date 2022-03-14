//Valores inciales de paginacion
var PAGINATION = {
    search: '',
    totalRecords: 0,
    recPerPage: 12,
    page: 1,
    totalPages: 0,
    next: null,
    previous: null,
    category: 0,
}

// orden principal de los productos
var ORDERING = 'category_id';
// Categorias
var CATEGORIES = { 0: 'Todo Producto' }

const baseURL = 'https://testapibsale.herokuapp.com/';
const URL_QUERY = baseURL + "list/";

jQuery.ajaxSetup({
    beforeSend: function () {
        $('#loader').show();
    },
    complete: function () {
        $('#loader').hide();
    },
    success: function () { }
});

$(document).ready(function () {

    //Query Init
    $(() => searchProducts(category = 0, page = 1, search = ''));
    $(() => getCategories());

    //Botón Search Modal
    $('#searchToggleButton').click(() => {
        $('#searchModal').modal('show');
    });

    //Botón Search
    $('#searchButton').click(() => {
        searchProducts(
            category = PAGINATION.category,
            page = 1,
            search = $('#searchKeyword').val()
        );
        $('#searchModal').modal('hide');
        return false;
    });
});

// Busqueda de productos ingresados en el input

// Render de productos y datos para paginacion
function searchProducts(category = 0, page = 1, search = '') {


    let cat_path = (category === 0) ? '' : category + '/';
    let search_path = 'search=' + search;
    let page_path = '?page=' + page;
    let order_path = 'ordering=' + ORDERING;

    const url = URL_QUERY + cat_path + page_path +
        '&' + search_path + '&' + order_path;
    console.log(url);
    $("#products").append(
        `<div class="container justify-content-center col-12" id="loader">
            <h5 class="text-primary text-center " >Cargando... 🔃</h5>
        </div>`
    );
    $.ajax({
        url: url
    }).then(data => {
        setValuesPagination(data, category, search, page);
        renderProduct(data);
        renderPagination();
    }).fail(() => {
        renderError();
    });
}

//Obtenemos las categorias
function getCategories() {


    const url = baseURL + "categories/"
    $.ajax({
        url: url
    }).then(data => {
        data.map((cat) => {
            CATEGORIES[cat.id] = cat.name
        });
        renderCategoriesMenu();
    }).fail(() => {
        alert("Failed to Load Categories Data");
    });

}

function renderProduct(data) {
    // Render de la informacion del producto

    $("#products").empty();
    {
        var last_category = '';
        data.results.map((product => {
            if (last_category !== product.category.name) {
                $("#products").append(`
                    <div class="container row justify-content-center" id="category_title">
                        <h4 class="text-uppercase text-success mt-2">` + product.category.name + `</h4>
                    </div>`)
                last_category = product.category.name;
            }
            // Control de ImagNotAviable
            if (product.url_image == null ||
                product.url_image == '') {
                product.url_image = 'images/image-not-available.png';
            }
           // Se crea la Card
            $("#products").append(
                `<div class="card m-2" style="width: 16rem;">
                        <img class="card-img-top" src="` + product.url_image + `" alt="` + product.name + `">
                        <div class="card-body">
                            <p class="card-text text-center">` + product.name + `</p>
                        </div>
                        <hr/>
                        <div class="card-body row row-content col-10 offset-1">
                            <p >$` + product.price + `</p>
                            <div class="ml-auto">
                                <a href="#" class="card-link"><span class="fa fa-cart-plus fa-2x"></span></a>
                            </div>
                        </div>
                </div>`
            );
        }));
    }
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

//Carga de datos de paginación
function setValuesPagination(data, category, search, page) {


    PAGINATION.search = search;
    PAGINATION.totalRecords = data.count;
    PAGINATION.next = data.next;
    PAGINATION.previous = data.previous;
    PAGINATION.totalPages = Math.ceil(PAGINATION.totalRecords / PAGINATION.recPerPage);
    PAGINATION.page = page;
    PAGINATION.category = category;
}
// Render de toda la paginación
function renderPagination() {
   
    var $pag = $('.paginationBar');
    let prev = PAGINATION.page - 1;
    let next = PAGINATION.page + 1;
    // console.log(JSON.stringify(PAGINATION))
    $pag.empty();

    // Boton anterior
    $pag.append(
        `<li class="page-item">
            <a onClick="searchProducts('
                category=` + PAGINATION.category +
        `,page=` + prev +
        `,search='` + PAGINATION.search + `')"
                class="page-link" role="button">Previous</a>
        </li>`
    );

    // Cantidad de paginas
    for (let i = 1; i <= PAGINATION.totalPages; i++) {
        if (PAGINATION.page === i) {
            $pag.append(
                `
            <li class="page-item active">
                <a class="page-link" href="#">` + i + `<span class="sr-only">(current)</span></a>
            </li>`
            );
        }
        else {
            $pag.append(
                `<li class="page-item">
                <a onClick="searchProducts(
                    category=` + PAGINATION.category +
                `,page=` + i +
                `,search='` + PAGINATION.search + `')"
                    class="page-link" role="button">` + i + `</a>
                </li>`
            );
        }
    }

    // Boton siguiente
    $pag.append(
        `<li class="page-item">
            <a onClick="searchProducts(
                category=` + PAGINATION.category +
        `,page=` + next +
        `,search='` + PAGINATION.search + `')"
                class="page-link" role="button">Next</a>
        </li>`
    );

    // Desactiva prev y next dependiendo de la pagina
    if (PAGINATION.previous === null)
        $("#paginationBar li:first").addClass("disabled");
    if (PAGINATION.next === null)
        $("#paginationBar li:last").addClass("disabled");
}

function renderCategoriesMenu() {
    
    $('#categories_menu').append(
        `<li><a id="cat_` + 0 + `"
            onClick="setActiveAndSearch(` + 0 + `)"
            class="dropdown-item" role="button">` + 'Todo producto' + `</a>
        </li>`
    );
    len = Object.keys(CATEGORIES).length;
    for (let i = 1; i <= len; i++) {
        $('#categories_menu').append(
            `<li><a id="cat_` + i + `"
                onClick="setActiveAndSearch(` + i + `)"
                class="dropdown-item" role="button">` + CATEGORIES[i] + `</a>
            </li>`
        );
    }
}

//Paginacion, orden y busqueda. 
function setOrdering(ordering = 'category_id') {


    let ordering_title = {
        'All': 'All Products',
        'category_id': 'Category',
        'name': 'A - Z',
        '-name': 'Z - A',
        'price': 'Lower price first',
        '-price': 'Higher price first',
    }

    $('#ordering_menu').children().children().removeClass("active");
    $('#ord-' + ordering).addClass("active");

    $('#selectedOrdering').text(ordering_title[ordering]);

    ORDERING = ordering;

    searchProducts(
        category = PAGINATION.category,
        page = 1,
        search = PAGINATION.search);
}


// Se buscan productos segun palabra ingresada en el input.
function setActiveAndSearch(category = 0) {
 

    $('#categories_menu').children().children().removeClass("active");
    $('#cat_' + category).addClass("active");

    $('#selectedCategory').text(' ' + CATEGORIES[category.toString()]);

    searchProducts(
        category = category,
        page = 1,
        search = PAGINATION.search);
}

//text_danger  error de carga.
function renderError() {
    var $pag = $('#paginationBar');
    $pag.append('<h3 class="text-danger">Error al cargar productos...</h3>')
}

