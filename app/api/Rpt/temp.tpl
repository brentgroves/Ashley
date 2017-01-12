<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/flot/0.8.1/jquery.flot.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/flot/0.8.1/jquery.flot.categories.min.js"></script>

<style>
{#asset custom.css}
</style>
<table>
<tbody>
<tr>
<td style='padding-right: 300px;'><img src='{#image logoIN250}'></td>
<td>
    <strong>Duplicate Copy</strong><br/>
    <strong>Purchase Order: {{poNumbers.[0].poNumber}}</strong><br/>
    <strong>Vendor: {{poNumbers.[0].fvendno}}</strong>
</td>
</tr>
<tr>
<td style='padding-right: 300px;'><strong>To:</strong><br/>
{{poNumbers.[0].fccompany}}<br/>
{{poNumbers.[0].fmstreet}}<br/>
{{poNumbers.[0].fccity}}, {{poNumbers.[0].fcstate}} {{poNumbers.[0].fczip}}<br/>
{{poNumbers.[0].fccountry}}<br/>
</td>
<td><strong>Ship to : </strong><br/>
BUSCHE<br/>
1563 E. State Road 8<br/>
P.O. Box 77<br/>
ALBION, IN 46701-0077<br/>
USA<br/>
</td>
</tr>
</tbody>
</table>


<br/>

<h6> <span style='padding-left:10px'>Phone:{{poNumbers.[0].fcphone}}</span><span style='padding-left:10px'> Fax: {{poNumbers.[0].fcfax}}</span></h6>
<table style="margin-bottom:0px" class="table table-bordered">
    <thead>
    <tr>
        <th>PO Date</th>
        <th>Ship Via</th>
        <th>FOB</th>
        <th>Planner</th>
        <th>Confirming to</th>
        <th>Terms</th>
    </tr>
    </thead>
<tbody>
    <tr>
        <td>{{poNumbers.[0].poDate}}</td>
        <td>{{poNumbers.[0].fshipvia}}</td>
        <td>{{poNumbers.[0].ffob}}</td>
        <td>CM</td>
        <td>&nbsp;</td>
        <td>{{poNumbers.[0].fcterms}}</td>
    </tr>
</tbody>

</table>
<table class="table table-bordered ">
    <thead>
    <tr>
        <th>Item</th>
        <th>Part/Rev/Description/Details</th>
        <th>Quantity</th>
        <th>Promised<br/>Delivery</th>
        <th>Unit Cost</th>
        <th>Extended Cost</th>
    </tr>
    </thead>
<tbody>
{{#each poNumbers}}
    <tr>
        <td>{{rowNumber}}</td>
        <td>{{fmtDesc itemDescription}}<br/>
        Category :&nbsp {{pocategory}}</td>
        <td>{{qtyOrd}}</td>
        <td>{{received}}</td>
        <td>${{cost}}</td>
        <td>${{extCost}}</td>
    </tr>
{{/each}}
</tbody>

</table>

        <td colspan="5" class="text-right" >
<div class="container">
  <div class="row">
    <div class="col">
      1 of 2
    </div>
    <div class="col">
      1 of 2
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      1 of 3
    </div>
  </div>
</div>
        Total Items Price: ${{totCost ../poNumbers}}
        </br>Sales Tax  $0.00
        </br>Fixed Cost $0.00
        </table>
        </td>
        <td colspan="5" class="text-right" >
            <table>
                <tr>
                    <td>
                        Total Items Price: 
                    </td>
                    <td>
                        ${{totCost ../poNumbers}}
                    </td>
                </tr>
                <tr>
                    <td>
                        Sales Tax  
                    </td>
                    <td>
                        $0.00
                    </td>
                </tr>
                <tr>
                    <td>
                        Fixed Cost 
                    </td>
                    <td>
                        $0.00
                    </td>
                </tr>

            </table>
        </td>


            <table class="text-right">
                <tr>
                    <td>
                        Total Items Price: 
                    </td>
                    <td>
                        ${{totCost ../poNumbers}}
                    </td>
                </tr>
                <tr>
                    <td>
                        Sales Tax  
                    </td>
                    <td>
                        $0.00
                    </td>
                </tr>
                <tr>
                    <td>
                        Fixed Cost 
                    </td>
                    <td>
                        $0.00
                    </td>
                </tr>

            </table>
        </td>



