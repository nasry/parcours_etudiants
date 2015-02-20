var EditableTable = function (currentTable, currentTableEdit) {

    return {

        //main function to initiate the module
        init: function (currentTable, currentTableEdit) {
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var x = 0, iLen = jqTds.length; x < iLen; x++) {
                    oTable.fnUpdate(aData[x], nRow, x, false);
                }

                oTable.fnDraw();
            }

            function editRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
				var i = 0 ;
				for (i, iLen = jqTds.length; i < iLen-2; i++) {
                    jqTds[i].innerHTML = '<input type="text" class=" small" value="' + aData[i] + '">';
                }
                jqTds[i].innerHTML = '<a class="edit" href="">Save</a>';
                jqTds[i+1].innerHTML = '<a class="cancel" href="">Cancel</a>';
            }

            function saveRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
				var j = 0;
				for (j, iLen = jqInputs.length; j < iLen; j++) {
                    oTable.fnUpdate(jqInputs[j].value, nRow, j, false);
                }
                oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, j, false);
                oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, j+1, false);
                oTable.fnDraw();
            }

            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
				var k = 0 ;
				for (k, iLen = jqInputs.length; k < iLen-1; k++) {
                    oTable.fnUpdate(jqInputs[k].value, nRow, k, false);
                }
                oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, k, false);
                oTable.fnDraw();
            }

            var oTable = $(currentTable).dataTable({
                "aLengthMenu": [
                    [5, 10, 15, -1],
                    [5, 10, 15, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#editable-sample_wrapper .dataTables_filter input').addClass(" medium"); // modify table search input
            jQuery('#editable-sample_wrapper .dataTables_length select').addClass(" xsmall"); // modify table per page dropdown

            var nEditing = null;

            $(currentTableEdit).click(function (e) {
                e.preventDefault();
                var aiNew = oTable.fnAddData(['', '', '', '',
                        '<a class="edit" href="">Edit</a>', '<a class="cancel" data-mode="new" href="">Cancel</a>'
                ]);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
            });
			
			var td = currentTable+" a.delete" ;

            $(td).live('click', function (e) {
                e.preventDefault();

                if (confirm("Are you sure to delete this row ?") == false) {
                    return;
                }

                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
                alert("Deleted! Do not forget to do some ajax to sync with backend :)");
            });
			
			var tc = currentTable+" a.cancel" ;

            $(tc).live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });
			
			var te = currentTable+" a.edit" ;

            $(te).live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "Save") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                    alert("Updated! Do not forget to do some ajax to sync with backend :)");
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });
        }

    };

}();