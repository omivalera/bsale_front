// Global pagination object values
var PAGINATION = {
    search: '',
    totalRecords : 0,
    recPerPage : 12,
    page : 1,
    totalPages : 0,
    next : null,
    previous: null,
    category: 0,
}

// Search results ordering
var ORDERING = 'category_id';
// Product Categories
var CATEGORIES = { 0 : 'Todo Producto'}

const baseURL = "http://localhost:8000/";
const URL_QUERY = baseURL + "list/";

jQuery.ajaxSetup({
    beforeSend: function() {
       $('#loader').show();
    },
    complete: function(){
       $('#loader').hide();
    },
    success: function() {}
});

$(document).ready(function() {

    //Initial Query
    $( () => searchProducts(category=0, page = 1, search=''));
    $( () => getCategories());

    //Show Search Modal
    $('#searchToggleButton').click( () => {
        $('#searchModal').modal('show');
    });

    //Search Button
    $('#searchButton').click( () => {
        searchProducts(
            category=PAGINATION.category,
            page = 1,
            search= $('#searchKeyword').val()
            );
        $('#searchModal').modal('hide');
        return false;
    });
});

function searchProducts(category = 0, page = 1, search = '') {
    // Search Products related to search keyword from REST API, updates pagination,
    // render Products card and pagination bar

    let cat_path = (category === 0) ? '' : category + '/';
    let search_path = 'search=' + search;
    let page_path = '?page=' + page;
    let order_path = 'ordering=' + ORDERING;

    const url = URL_QUERY + cat_path + page_path +
        '&' + search_path + '&' + order_path;
    console.log(url);
    $("#products").append(
        `<div class="container justify-content-center col-12" id="loader">
            <h5 class="text-primary text-center " >Loading...</h5>
        </div>`
        );
    $.ajax({
        url: url
    }).then( data => {
        setValuesPagination(data, category, search, page);
        renderProduct (data);
        renderPagination();
    }).fail( () => {
        renderError();
    });
}

function getCategories() {
    // Get Categories from REST API

    const url = baseURL + "categories/"
    $.ajax({
        url: url
    }).then( data => {
        data.map( (cat) => {
            CATEGORIES[cat.id] = cat.name
        });
        renderCategoriesMenu();
    }).fail( () => {
        alert("Failed to Load Categories Data");
    });
    
}

function renderProduct(data) {
    // Render products Cards from data object

    $("#products").empty();
    {   var last_category = '';
        data.results.map( (product => {
            if (last_category !== product.category.name){
                $("#products").append(`
                    <div class="container row justify-content-center" id="category_title">
                        <h4 class="text-uppercase text-success mt-2">` + product.category.name + `</h4>
                    </div>`)
                last_category = product.category.name;
            }
            // Controling not available images
            if (product.url_image == null ||
                product.url_image == ''){
                product.url_image = 'images/image-not-available.png';
            }
            // Insert Card product
            $("#products").append(
                `<div class="card m-2" style="width: 16rem;">
                        <img class="card-img-top" src="` + product.url_image+ `" alt="`+ product.name + `">
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

function setValuesPagination(data, category, search, page) {
    // Update Pagination Object values

    PAGINATION.search = search;
    PAGINATION.totalRecords = data.count;
    PAGINATION.next = data.next;
    PAGINATION.previous = data.previous;
    PAGINATION.totalPages = Math.ceil(PAGINATION.totalRecords/PAGINATION.recPerPage);
    PAGINATION.page = page;
    PAGINATION.category = category;
}

function renderPagination() {
    // Render pagination navbar from pagination object values
    var $pag = $('.paginationBar');
    let prev = PAGINATION.page - 1;
    let next = PAGINATION.page + 1;
    // console.log(JSON.stringify(PAGINATION))
    $pag.empty();
    
    // Previous pagination button
    $pag.append(
        `<li class="page-item">
            <a onClick="searchProducts('
                category=` + PAGINATION.category +
                `,page=` + prev +
                `,search='` + PAGINATION.search + `')"
                class="page-link" role="button">Previous</a>
        </li>`
        );
    
    // Page numbers pagination buttons
    for (let i = 1; i <= PAGINATION.totalPages; i++){
        if (PAGINATION.page === i){
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

    // Next pagination button
    $pag.append(
        `<li class="page-item">
            <a onClick="searchProducts(
                category=` + PAGINATION.category +
                `,page=` + next + 
                `,search='` + PAGINATION.search + `')"
                class="page-link" role="button">Next</a>
        </li>`
    );
    
    // Disable next 'n previous buttons according to actual page
    if (PAGINATION.previous === null)
        $("#paginationBar li:first").addClass("disabled");
    if (PAGINATION.next === null)
        $("#paginationBar li:last").addClass("disabled");        
}

function renderCategoriesMenu() {
    // Insert Categories in dropdown menu
    $('#categories_menu').append(
        `<li><a id="cat_` + 0 + `"
            onClick="setActiveAndSearch(` + 0 + `)"
            class="dropdown-item" role="button">` + 'Todo producto' + `</a>
        </li>`
    );
    len = Object.keys(CATEGORIES).length;
    for (let i = 1; i <= len; i++) {
        $('#categories_menu').append(
            `<li><a id="cat_` + i+ `"
                onClick="setActiveAndSearch(` + i + `)"
                class="dropdown-item" role="button">` + CATEGORIES[i] + `</a>
            </li>`
        );    
    }
}

function setOrdering(ordering='category_id') {
    // Set active ordering option and in dropdown menu

    let ordering_title = {
        'category_id' : 'Category',
        'name' : 'A - Z',
        '-name' : 'Z - A',
        'price' : 'Lower price first',
        '-price' : 'Higher price first',
    }

    $('#ordering_menu').children().children().removeClass("active");
    $('#ord-' + ordering).addClass("active");

    $('#selectedOrdering').text(ordering_title[ordering]);

    ORDERING = ordering;

    searchProducts(
        category= PAGINATION.category,
        page= 1 ,
        search= PAGINATION.search );
}

function setActiveAndSearch(category=0) {
    // Auxiliar function for searching by category and
    // set active the category in dropdown menu

    $('#categories_menu').children().children().removeClass("active");
    $('#cat_' + category).addClass("active");

    $('#selectedCategory').text(' ' + CATEGORIES[category.toString()]);

    searchProducts(
        category= category,
        page= 1 ,
        search= PAGINATION.search );
}

function renderError(){
    var $pag = $('#paginationBar');
    $pag.append( '<h3 class="text-danger">Failed to load products...</h3>')
}

