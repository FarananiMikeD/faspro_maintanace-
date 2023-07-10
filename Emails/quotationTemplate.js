exports.quotationMSG = (quotation, quotationNumber, invoiceSettingId, savedLeadInvoice, createdDate, dueDate) => `

<!DOCTYPE html>
<html>

<head>
    <title>Invoice Quotation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        ul li {
            font-size: 14px;
            line-height: 1.5;
        }

        .container {
            max-width: 70%;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-top: 20px solid #e5e5e5;
            border-left: 20px solid #e5e5e5;
            border-right: 20px solid #e5e5e5;
            border-bottom: 20px solid #e5e5e5;
        }

        .header {
            display: flex;
            align-items: center;
            border-radius: 5px;
            background: #26A958;
            color: #fff;
        }

        .header img {
            width: 100%;
        }

        .logo {
            width: 30%;
            margin-right: 20px;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
        }

        .invoice-details {
            display: flex;
            justify-content: center;
        }

        .invoice-details {
            font-size: 14px;
            line-height: 1.5;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            border-spacing: 0;
            color: #4a4a4d;
            font: 14px/1.4 "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        th,
        td {
            padding: 10px 15px;
            vertical-align: middle;
        }

        thead {
            background: #26A958;
            color: #fff;
            font-size: 11px;
            text-transform: uppercase;
            border-radius: 15px !important;
        }

        th:first-child {
            border-top-left-radius: 5px;
            text-align: left;
        }

        th:last-child {
            border-top-right-radius: 5px;
        }

        tbody tr:nth-child(even) {
            background: #f0f0f2;
        }

        td {
            border-bottom: 1px solid #cecfd5;
            border-right: 1px solid #cecfd5;
        }

        td:first-child {
            border-left: 1px solid #cecfd5;
        }

        .book-title {
            color: #ffffff;
            display: block;
        }

        .text-offset {
            color: #7c7c80;
            font-size: 12px;
        }

        .item-stock,
        .item-qty {
            text-align: center;
        }

        .item-price {
            text-align: right;
        }

        .item-multiple {
            display: block;
        }

        tfoot {
            text-align: right;
        }

        tfoot tr:last-child {
            background: #f0f0f2;
            color: #26A958;
            font-weight: bold;
            font-size: 14px;
        }

        tfoot tr:last-child td:first-child {
            border-bottom-left-radius: 5px;
        }

        tfoot tr:last-child td:last-child {
            border-bottom-right-radius: 5px;
        }

        .green {
            background-color: green;
            color: white;
        }

        .red {
            background-color: red;
            color: white;
        }

        .orange {
            background-color: orange;
            color: white;
        }

        #terms {
            margin-top: 20px;
        }

        #note {
            margin-top: 20px;
            font-style: italic;
        }

        .bank-details {
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
            width: 50%;
            border-radius: 5px;
        }

        .bank-details h4 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }

        .bank-details ul {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }

        .bank-details li {
            margin-bottom: 5px;
        }

        .bank-details li:last-child {
            margin-bottom: 0;
        }

        .terms-container {
            margin-top: 20px;
            padding: 10px;
            border-top: 1px solid #f2f2f2;
            font-size: 14px;
        }

        .note-container {
            margin-top: 20px;
            padding: 10px;
            border-top: 1px solid #f2f2f2;
            font-size: 14px;
        }

        .invoice-footer {
            background-color: #f2f2f2;
            text-align: right;
            font-size: 12px;
            padding: 10px;
            margin-top: 2em;
        }

        .invoice-footer p {
            margin: 0;
        }

        .invoice-footer hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 5px 0;
        }

        .subtotal-container {
            margin-top: 30px;
            border: 1px solid #f4f4f4;
            padding: 10px;
            width: 35%;
        }

        .subtotal-row,
        .vat-row,
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .subtotal-label,
        .vat-label,
        .total-label {
            font-weight: bold;
        }

        .subtotal-amount,
        .vat-amount,
        .total-amount {
            font-weight: bold;
        }

        .vat-row {
            color: #888;
        }

        .header__details,
        .billed__to__details {
            border-radius: 5px;
            padding: 1em 0;
            width: 50%;
        }

        .hide {
            display: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <header class="header">
            <img class="logo" src="https://admin.faspro24.com/static/media/logo-light.f1e4dccb3e6c59fb6832.png"
                alt="Logo">
        </header>

        <h4 style="text-align:center">Address: ${invoiceSettingId?.address} | Phone number:
            ${invoiceSettingId?.phoneNumber} | Email: ${invoiceSettingId?.email}
        </h4>

        <div class="title"> Quotation </div>

        <div class="invoice-details">
            <div class="header__details">
                <div>Quotation Number: <b> ${quotationNumber} </b></div>
                <div>Created date: ${createdDate} </div>
                <div>Due date: ${dueDate} </div>
            </div>
            <div class="billed__to__details">
                <b>Billed To:</b>
                <div>Company name: ${quotation.companyName}</div>
                <div>Full name: ${quotation.firstName} ${quotation.lastName} </div>
                <div>Email: ${quotation.email}</div>
                <div>Contact: ${quotation.phoneNumber}</div>
            </div>

        </div>

        <table id="myTable">
            <thead>
                <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td> Number of users </td>
                    <td>${savedLeadInvoice.numberOfUsers} users</td>
                    <td class="item-qty">$${savedLeadInvoice.numberOfUsersAmount}</td>
                    <td class="item-qty">$${savedLeadInvoice.numberOfUsersAmount}</td>
                </tr>
                <tr>
                    <td> Number of units </td>
                    <td>${savedLeadInvoice.numberOfUnits} units</td>
                    <td class="item-qty">$${savedLeadInvoice.numberOfUnitsAmount}</td>
                    <td class="item-qty">$${savedLeadInvoice.numberOfUnitsAmount}</td>
                </tr>


                ${savedLeadInvoice.facility !== "facility" ? (`
                <tr>
                    <td> - </td>
                    <td> - </td>
                    <td class="item-qty"> - </td>
                    <td class="item-qty"> - </td>
                </tr>`) : (`
                <tr>
                    <td> ${savedLeadInvoice.facility} - module </td>
                    <td> 1 </td>
                    <td class="item-qty"> ${savedLeadInvoice.facilityPrice} </td>
                    <td class="item-qty"> ${savedLeadInvoice.facilityPrice} </td>
                </tr>` )} ${savedLeadInvoice.maintenance !== "maintenance" ? (`
                <tr>
                    <td> - </td>
                    <td> - </td>
                    <td class="item-qty"> - </td>
                    <td class="item-qty"> - </td>
                </tr>`) : (`
                <tr>
                    <td> ${savedLeadInvoice.maintenance} - module </td>
                    <td> 1 </td>
                    <td class="item-qty"> ${savedLeadInvoice.maintenancePrice} </td>
                    <td class="item-qty">${savedLeadInvoice.maintenancePrice} </td>
                </tr>` )} ${savedLeadInvoice.security !== "security" ? (`
                <tr>
                    <td> - </td>
                    <td> - </td>
                    <td class="item-qty"> - </td>
                    <td class="item-qty"> - </td>
                </tr>`) : (`
                <tr>
                    <td> ${savedLeadInvoice.security} - module </td>
                    <td> 1 </td>
                    <td class="item-qty"> ${savedLeadInvoice.securityPrice} </td>
                    <td class="item-qty"> &#8615;${savedLeadInvoice.securityPrice} </td>
                </tr>` )} ${savedLeadInvoice.assets !== "assets" ? (`
                <tr>
                    <td> - </td>
                    <td> - </td>
                    <td class="item-qty"> - </td>
                    <td class="item-qty"> - </td>
                </tr>`) : (`
                <tr>
                    <td> ${savedLeadInvoice.assets} - module </td>
                    <td> 1 </td>
                    <td class="item-qty"> ${savedLeadInvoice.assetsPrice} </td>
                    <td class="item-qty">${savedLeadInvoice.assetsPrice} </td>
                </tr>` )} ${savedLeadInvoice.fileManagement !== "fileManagement" ? (`
                <tr>
                    <td> - </td>
                    <td> - </td>
                    <td class="item-qty"> - </td>
                    <td class="item-qty"> - </td>
                </tr>`) : (`
                <tr>
                    <td> ${savedLeadInvoice.fileManagement} - module </td>
                    <td> 1 </td>
                    <td class="item-qty">${savedLeadInvoice.fileManagementPrice}</td>
                    <td class="item-qty">${savedLeadInvoice.fileManagementPrice}</td>
                </tr>` )} ${savedLeadInvoice.bookings !== "booking" ? (`
                <tr>
                    <td> - </td>
                    <td> - </td>
                    <td class="item-qty"> - </td>
                    <td class="item-qty"> - </td>
                </tr>`) : (`
                <tr>
                    <td> ${savedLeadInvoice.bookings} - module </td>
                    <td> 1 </td>
                    <td class="item-qty"> ${savedLeadInvoice.bookingsPrice} </td>
                    <td class="item-qty"> ${savedLeadInvoice.bookingsPrice} </td>
                </tr>` )}



            </tbody>

            <tfoot>
                <tr class="text-offset">
                    <td colspan="3"><b>Sub -Total</b></td>
                    <td><b>$${savedLeadInvoice.totalAmount}</b></td>
                </tr>
                <tr class="text-offset">
                    <td colspan="3"><b>Discount total (${savedLeadInvoice.discountPercentage}%) </b></td>
                    <td><b>$${savedLeadInvoice.discountAmount}</b></td>
                </tr>
                <tr class="text-offset">
                    <td colspan="3"><b>Total excluding Vat</b></td>
                    <td><b>$${savedLeadInvoice.total_with_or_without_dis}</b></td>
                </tr>
                <tr class="text-offset">
                    <td colspan="3"><b>Vat (${savedLeadInvoice.vatPercentage}%) </b></td>
                    <td><b>$${savedLeadInvoice.vatAmount}</b></td>
                </tr>
                <tr class="text-offset">
                    <td colspan="3"><b>Total Including Vat</b></td>
                    <td><b>$${savedLeadInvoice.total_with_or_without_vat}</b></td>
                </tr>
            </tfoot>
        </table>


        <div class="terms-container">
            <h4>Terms and Conditions</h4>
            <p>
                ${invoiceSettingId.note}
            </p>
        </div>

        <div class="note-container">
            <h4>Note</h4>
            <p> ${invoiceSettingId.termsAndCondition}
            </p>
        </div>

</body>

</html>

`