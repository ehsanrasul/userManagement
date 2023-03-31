
var url = "https://jsonplaceholder.typicode.com/todos/";

$(document).ready(function () {

    axios.get(url)
        .then((response) => {
            response.data.forEach((item) => {
                $('#Records').find('tbody').append([
                    '<tr data-id="' + item.id + '">',
                    '<td>' + item.userId + '</td>',
                    '<td>' + item.title + '</td>',
                    '<td>' + item.id + '</td>',
                    '<td>' + item.completed + '</td>',
                    '<td>',
                    '<div style="display:inline; align-items:left">',
                    '<button  id="edit" class="btn btn-danger btn-sm-8" style="margin-right: 5px;">Edit</button>',
                    '<button  id="delete" class="btn btn-danger btn-sm-8" style="margin-left: 5px;">Delete</button>',
                    '</div>',
                    '</td>',
                    '</tr>'
                ].join(''));
            })
        })
        .catch((error) => {
            console.log("Not Found");
            alert("invalid input");
        })




    //Adding Data
    $('#addData').click((e) => {
        e.preventDefault()

        $('#form-add').css('display', 'block')

        $("#form-add").submit((event) => {
            event.preventDefault()

            var userID = $("#form-add #userID").val()
            var Title = $("#form-add #title").val()
            var Id = $("#form-add #id").val()
            var Completed = $("#form-add input[name='flexRadioDefault']:checked").val();


            $.ajax({
                url: "https://jsonplaceholder.typicode.com/todos",
                method: "POST", // 
                data: {
                    title: Title,
                    userId: userID,
                    id: Id,
                    completed: Completed
                },
                success: function (response) {
                    $('#Records').find('tbody').append([
                        '<tr data-id="' + Id + '">',
                        '<td>' + userID + '</td>',
                        '<td>' + Title + '</td>',
                        '<td>' + Id + '</td>',
                        '<td>' + Completed + '</td>',
                        '<td>',
                        '<div style="display:inline; align-items:left">',
                        '<button  id="edit" class="btn btn-danger btn-sm-8" style="margin-right: 5px;">Edit</button>',
                        '<button  id="delete" class="btn btn-danger btn-sm-8" style="margin-left: 5px;">Delete</button>',
                        '</div>',
                        '</td>',
                        '</tr>'
                    ].join(''));

                    $('#form-add').css('display', 'none')
                    alert("Data added successfully");

                },
                error: function (xhr, status, error) {
                    // handle the error response from the server
                    console.log("Error adding data:", error);
                }
            });
        })
    })


        //Deleting Records
    $('#Records').on('click', '#delete', function () {
        var row = $(this).closest('tr');
        var id = row.data('id');

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts/' + id,
            type: 'DELETE',
            success: function (result) {
                console.log('Post deleted successfully');
                row.remove();
            },
            error: function (xhr, status, error) {
                console.log('Error deleting post:', error);
            }
        });
    });



    //updating Data
$('#Records').on('click', '#edit', function () {
    var row = $(this).closest('tr');
    var id = row.data('id');
    console.log("id " + id)
    $('#form-update').css('display', 'block')
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/todos/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#form-update #userID").val(data.userId)
            $("#form-update #title").val(data.title)
            $("#form-update #id").val(data.id)
            $("#form-update input[name='myRadioGroup'][value='" + data.completed + "']").prop("checked", true);
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error:', textStatus, errorThrown);
        }

    });


    $("#form-update").submit((e) => {
        e.preventDefault()

        var userID = $("#form-update #userID").val()
        var Title = $("#form-update #title").val()
        var Id = $("#form-update #id").val()
        var Completed = $("#form-update input[name='flexRadioDefault']:checked").val();

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/todos/' + id, // replace 1 with the ID of the record you want to update
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                title: Title,
                userId: userID,
                id: Id,
                completed: Completed
            }),
            success: function (response) {
                console.log(response); // logs the updated record object
            },
            error: function (error) {
                console.error("errr " + error); // logs any errors that occur
            }
        });


        var row = document.querySelector("#Records tr[data-id='" + id + "']");


        row.setAttribute("data-id", id);
        row.cells[0].textContent = userID;
        row.cells[1].textContent = Title;
        row.cells[2].textContent = Id;
        row.cells[3].textContent = Completed;
        row.cells[4].innerHTML = '<div style="display:inline; align-items:left">' +
            '<button  id="edit" class="btn btn-danger btn-sm-8" style="margin-right: 5px;">Edit</button>' +
            '<button  id="delete" class="btn btn-danger btn-sm-8" style="margin-left: 5px;">Delete</button>' +
            '</div>';

        $('#form-update').css('display', 'none')

    })

})





//Sorting the Data
$(document).ready(function() {
    // Sort table when column header is clicked
    $('th').click(function() {
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(compare($(this).index()));
        this.asc = !this.asc;
        if (!this.asc) {
            rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++) {
            table.append(rows[i]);
        }
    });

    // Comparison function for sorting
    function compare(index) {
        return function(a, b) {
            var valA = getCellValue(a, index);
            var valB = getCellValue(b, index);
            if ($.isNumeric(valA) && $.isNumeric(valB)) {
                return valA - valB;
            } else {
                return valA.localeCompare(valB);
            }
        };
    }

    // Get the value of a cell
    function getCellValue(row, index) {
        return $(row).children('td').eq(index).text();
    }
});

});
