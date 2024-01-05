// catch element

let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");

let btnCreate = document.getElementById("Create");
let search = document.getElementById("search");
let btntitle = document.getElementById("btntitle");
let btncategory = document.getElementById("btncategory");

let table = document.getElementById("table");
let tbody = document.getElementById("tbody");

let btnDeleteall = document.getElementById("btnDeleteall");

console.log(table, tbody, btnDeleteall);

let mode = "create";
let fake;
let allproducts;
if (localStorage.product != null) {
  allproducts = JSON.parse(localStorage.product);
} else {
  allproducts = [];
}

//get total

price.onkeyup = getTotal;
taxes.onkeyup = getTotal;
ads.onkeyup = getTotal;
discount.onkeyup = getTotal;

function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.classList.add("bg-dark");
  } else {
    total.innerHTML = "";
    total.classList.remove("bg-dark");
  }
}

//create

btnCreate.addEventListener("click", function () {
  if (title.value != "" && price.value != "" && category.value != "") {
    if (mode === "create") {
      let newProduct = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value,
      };
      swal({
        title: "Good job!",
       
        icon: "success",
        button: "Add New",
      });

      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          allproducts.push(newProduct);
        }
      } else {
        allproducts.push(newProduct);
     
        clear();
      }
    } else if (mode === "update") {
      // console.log("update");
      allproducts[fake].title = title.value;
      allproducts[fake].price = price.value;
      allproducts[fake].taxes = taxes.value;
      allproducts[fake].ads = ads.value;
      allproducts[fake].discount = discount.value;
      allproducts[fake].total = total.innerHTML;
      allproducts[fake].category = category.value;
      btnCreate.innerHTML = "Create";
      mode = "create";
      count.classList.remove("d-none");
    } else {
      clear();
    }
  }else{
    swal ( "Oops" ,  "All Input does not have to be empty" ,  "error" )
  }

  localStorage.setItem("product", JSON.stringify(allproducts));
  showProducts();
  clear();
});

//read

function showProducts() {
  let empty = "";

  for (let i = 0; i < allproducts.length; i++) {
    empty += `
                <tr>
                <td> ${i} </td>
                <td> ${allproducts[i].title} </td>
                <td> ${allproducts[i].price} </td>
                <td> ${allproducts[i].taxes} </td>
                <td> ${allproducts[i].ads} </td>
                <td> ${allproducts[i].discount} </td>

                <td> ${allproducts[i].total} </td>

                <td> ${allproducts[i].category} </td>

                <td>
                <button class="btn btnUpdate" onclick=update(${i})>update</button>
                </td>
                <td>
                <button class="btn btnDelet" onclick=deletProduct(${i})>Delete</button>
                </td>
                </tr>
                `;
  }
  tbody.innerHTML = empty;

  if (allproducts.length > 0) {
    // console.log("There are elements in array   ");
    btnDeleteall.classList.remove("d-none");
    btnDeleteall.innerHTML = `Delete All (${allproducts.length})`;
  } else {
    // console.log("There are no products"); //make when i create products and delete it
    btnDeleteall.classList.add("d-none");
  }
}
showProducts();

// clear input
function clear() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
  total.innerHTML = "";
  total.classList.remove("bg-dark");
}

// delete product

function deletProduct(index) {
  allproducts.splice(index, 1);
  localStorage.setItem("product", JSON.stringify(allproducts));
  // localStorage.product = JSON.stringify(allproducts);

  showProducts();
}

// delete All Products

btnDeleteall.onclick = function () {
  localStorage.clear();
  allproducts.splice(0);
  showProducts();
};

// update

function update(index) {
  fake = index;
  title.value = allproducts[index].title;
  price.value = allproducts[index].price;
  taxes.value = allproducts[index].taxes;
  ads.value = allproducts[index].ads;
  discount.value = allproducts[index].discount;
  getTotal();
  category.value = allproducts[index].category;
  btnCreate.innerHTML = "Update";
  mode = "update";

  count.classList.add("d-none");
}

// search


function getSearchResults() {
  let empty = "";
  const searchValue = search.value.toLowerCase(); // Convert search value to lowercase for case-insensitive comparison
  const searchByTitle = btntitle.classList.contains("active"); // Check if searching by title is active
  const searchByCategory = btncategory.classList.contains("active"); // Check if searching by category is active

  for (let i = 0; i < allproducts.length; i++) {
    const productTitle = allproducts[i].title.toLowerCase();
    const productCategory = allproducts[i].category.toLowerCase();

    if (
      (searchByTitle && productTitle.includes(searchValue)) ||
      (searchByCategory && productCategory.includes(searchValue))
    ) {
      empty += `
        <tr>
          <td>${i}</td>
          <td>${allproducts[i].title}</td>
          <td>${allproducts[i].price}</td>
          <td>${allproducts[i].taxes}</td>
          <td>${allproducts[i].ads}</td>
          <td>${allproducts[i].discount}</td>
          <td>${allproducts[i].total}</td>
          <td>${allproducts[i].category}</td>
          <td>
            <button class="btn btn-outline-primary" onclick="update(${i})">update</button>
          </td>
          <td>
            <button class="btn btn-outline-success" onclick="deletProduct(${i})">Delete</button>
          </td>
        </tr>
      `;
    }
  }

  tbody.innerHTML = empty;
}

btntitle.addEventListener("click", function () {
  search.focus();
  search.onkeyup = getSearchResults;
  btntitle.classList.add("active"); // Add 'active' class to indicate searching by title
  btncategory.classList.remove("active"); // Remove 'active' class from searching by category
});

btncategory.addEventListener("click", function () {
  search.focus();
  search.onkeyup = getSearchResults;
  btntitle.classList.remove("active"); // Remove 'active' class from searching by title
  btncategory.classList.add("active"); // Add 'active' class to indicate searching by category
});
