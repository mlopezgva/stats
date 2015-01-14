// Javascript for statistical project
// a = "1,1,2,2,2,3,3,3,3,4,4,4,5,5,5,5,6,6,6,6,6,7,7,7,8,8,8,8,8,9,9,9,9,9,4,4,3,3,3,2,2,5,5,6,6,6,7,7,1,1,8".split(/\W/)
// 150 173 266 260 224 201 240 289 140 256 275 282 293 178 162 132 112 221 291 301 160 124 299 164 173
/* Variáveis globais */

var aba_inicial = 'cl';

function roundTo(number, decimals) {
    return parseFloat(number.toFixed(decimals));
}

function activa(aba_id, r) {
    var id = aba_id.substr(-2);
    if (id == '') return;
    var frm_id    = "#frm_" + id;
    var aba_ativa = '#'+id;

    $("#abas span.on").removeClass('on').addClass('off');
    $('#'+aba_id).removeClass('off').addClass("on");
    $("#formulario > div").hide();
    $(aba_ativa).show();
    if (!r) $("#acao").val(id);

    if (id == 'mi' || id == 'gv')
        $("#resultados_discretos").show();
    else
        $("#resultados_discretos").hide();
}

//objeto msgBox, métodos show, hide/close, propriedade: Modal=true, msgTimeOut=undefined
var msgBox = {
    show: function(msgText, titulo, msgTimeOut) {
        (titulo != undefined) ? msgBox.setTitle(titulo) : msgBox.setTitle('Mensagem');
        if (typeof(msgTimeOut) == 'number') window.setTimeout('msgBox.hide()', msgTimeOut);
        if (msgText == '' || msgText == undefined) return true;
        else msgBox.setMsgText(msgText, msgTimeOut);

        $('body').append('<div id="scrBlock" />');
        $('#msg_box').fadeIn('fast');
        if (typeof(shortcut) != 'undefined') {
            shortcut.remove("enter");
            shortcut.remove("esc");
            shortcut.add("enter",function() {$('#msg_box_close').click();});
            shortcut.add("esc",function() {$('#msg_box_close').click();});
            shortcut.add("alt+o",function() {$('#msg_box_close').click();});
        }
    },
    setTitle: function(titulo) {
        $('#msg_box').attr('title', titulo);
    },
    setMsgText: function(text, msgTimeOut) {
        $('#msg_box').html(text + '<br />');
        //console.log("msgTimeOut value "+msgTimeOut+", tipo "+typeof(msgTimeOut));
        if (typeof(msgTimeOut) != 'number') {
            $('#msg_box').append('<button type="button" class="small red" onclick="msgBox.hide()" id="msg_box_hide">&nbsp;<u>O</u>K&nbsp;</button>');
        }
    },
    hide: function() {
        var id = $('#formulario form:visible').attr('id').substr(-2);
        $('#msg_box_hide').unbind('click').remove();
        $('#msg_box').html('').fadeOut('normal');
        if (typeof(shortcut) != 'undefined') {
            shortcut.remove("enter");
            shortcut.remove("alt+o");
            shortcut.remove("esc");
        }

        $('#scrBlock').hide('fast').delay(200).remove();
        $('#scrBlock').hide('fast').delay(200).remove();
    }
}

// Math functions
// Central Tendency Measuring - Medidas de Tendência Central
// Mean, Moda - Media, Moda

// Defines global variables:
// N   elements count
// _X  Mean value
// Xi  Array with Variable or class mean point values
// Fi  Array with variable or class frequency
// Me  Median value
// Mo  Moda
var N=0, _X=0, Xi=[], Fi=[], Me=0, Mo=0;
var tFr=0;
var tXiFi=0;

Array.prototype.max = function() {
    var max=parseFloat(this[0]);
    this.forEach(function(i) {
        max = Math.max(max, parseFloat(i));
    });
    return max;
};
Array.prototype.min = function() {
    var min=parseFloat(this[0]);
    this.forEach(function(i) {
        min = Math.min(min, parseFloat(i));
    });
    return min;
};

Array.prototype.mean = function() {
    var soma = 0, Xi=[];
    this.forEach(function(i) {
        Xi.push(i);
        soma += parseFloat(i);
    });
    return soma/this.length;
};

Array.prototype.median = function() {
    var n = this.length;
    var arr = new Array;
    this.forEach(function(i) {
        arr.push(parseFloat(i));
    });
    arr.sort(function(a,b){return a - b});
    // midpoint for odd frequency distribution
    var m = parseInt(n/2);
    return (n%2==0) ? (arr[m-1]+arr[m])/2 : arr[m];
};

function groupedMedian(table_id) {
    var tbl = '#'+table_id+' tbody ';
    var fac = $(tbl+".fac");
    var Li  = $(tbl+".li");
    var Ls  = $(tbl+".ls");
    var Xi  = $(tbl+".xi");
    var Fi  = $(tbl+".fi");
    var n   = parseInt($("#"+table_id+" tfoot th.fi").text());
    // para dados tabulados
    var pos = (n+1)/2, faca=0, xi=0, xj=0;
    // para dados em classe
    var fi, C, li;

    if (table_id == 'classes_input') {
        C = parseFloat($(Ls[0]).text()) - parseFloat($(Li[0]).text());
    }

    fac.each(function(i, el) {
        fac = parseInt($(this).text());
        if (fac < parseInt(pos)) {
            faca = fac;
        } else {
            xi = parseFloat($(Xi[i]).text());
            xj = parseFloat($(Xi[i+1]).text());
            if (table_id == 'classes_input')
                li = parseFloat($(Li[i]).text());
            fi =  parseFloat($(Fi[i]).text());
            return false;
        }
    });
    if (isNaN(xi)) {
        xi = xj = 1; // Para dados não quantitativos!
    }
    if (table_id == 'classes_input') {
        return li+(((n/2)-faca)/fi)*C;
    } else {
        return (fac == parseInt(pos) && pos>fac)?(xi+xj)/2 : xi;
    }
}

function moda(data, classed) {
    var f=[], mo=[], d={};
    if (classed != true) {
        if (typeof(data)=='string')
            d = tabDiscreteData(data);

        if (data.mean == [].mean)
            d = tabDiscreteData(data);
        // Stores var frequencies in an array
    } else
        d = data;

    for (var i in d)
        f.push(parseFloat(d[i]));

    if (classed != true && f.min() == f.max())
        return 'AMODAL';

    // Stores the max freq. variables in a new array
    for (var i in d) {
        if (d[i] == f.max())
            mo.push(i);
    }
    if (mo.length == 1)
        var Mo = mo[0];
    else if (mo.length == 2)
        var Mo = "BIMODAL (" + mo[0]+" e " + mo[1] +")";
    else
        var Mo = "MULTIMODAL (" + mo.join(', ') + ")";
    return Mo;


}

function tabDiscreteData(data) {
    var Freq = {};
    var a = (typeof(data)=='string')?data.split(/\W/):data;

    a.forEach(function(i) {
        if (Freq[i] == undefined)
            Freq[i] = 1;
        else
            Freq[i]++;
    });
    return Freq;
}

function group_raw_data() {
    var Xi = [], Fi = [];

    var d = tabDiscreteData($('#raw_data').val());

    // Se tiver mais de 10 variáveis, muda para tabela de classes
    if (JSON.stringify(d).split(',').length > 10) {
        if (confirm("A tabulação dos dados têm mais de 10 variáveis.\nConsidere gerar uma tabela de distribuição por classes.\nUsar classificação?")) {
            classify_raw_data();
            return true;
        }
    }

    for (var i in d) {
        Xi.push(i);
        Fi.push(parseFloat(d[i]));
    }

    var i = 0;
    var rows = $("#grouped_input tbody tr");

    if (rows.length<Fi.length)
        for(var t=rows.length; t<Fi.length; t++)
            addTabbedTableRow();

    rows = $("#grouped_input tbody tr");
    for (var idx in Xi) {
        if (isNaN(parseFloat(Xi[idx])))
            continue;
        var xi = Xi[idx];
        var fi = Fi[idx];
        var row = rows[i++];
        $(row).find("td.xi").text(xi);
        $(row).find("td.fi").text(fi);
    }
    activa('tb');
    reCalcTabbedTable();
}

function classify_raw_data() {
    var Xi = [], Fi = [];
    var rol = $('#raw_data').val().split(/[^.0-9]+/);
    rol.sort(function(a,b){return a - b});

    $("#classes_input tbody").html(''); // limpa a tabela
    N = rol.length;
    var C = rol.max()-rol.min(); // Amplitude da distribuição
    var H = Math.sqrt(N);        // Número de classes, aprox.

    H = (H>20) ? 20 : (H>=5) ? H : 0; // Máximo 20 classes, mínimo 5

    if (!H && !confirm("A amostra contém poucos dados para gerar uma tabela de classes,\nconsidere a análise de distribuição simples.\n\nDeseja continuar?"))
        return false;

    var A = (C/H > 1.5) ? parseInt(C/H + 0.5) : parseFloat((C/H).toFixed(2)); // Amplitide de classe

    var li = parseInt(rol[0]);  // Começa do começo
    var ls = li+A;      // Limite superior inicial
    var i=0; c=0;       // c conta os elementos que estão na classe
    while (i<rol.length) {
        while(rol[i]<ls) {
            c++; i++;
        }
        addClassTableRow(li, ls, c);
        li = ls;
        ls += A;

        c = 0;
    }
    activa('cl');
    reCalcClassedTable();
}

$(function() {
    $("#tb .grouped_res").hide();
    $("#cl .grouped_res").hide();
    /**
     * Calculando automaticamente as medidas de tendência central
     * e outros valores para distribuições simples
     **/
    $("#raw_data").keyup(function() {
        if ($(this).val().length > 2)
            var data = $.trim($(this).val()).split(/[^.0-9]+/);
            data.sort(function(a,b){return a-b});

            if (data.length>2) {
                var media, mediana, minval, maxval;
                _X = data.mean().toFixed(4);
                Me = data.median();
                Mo = moda(data);
                minval = data.min();
                maxval = data.max();
                C  = maxval - minval;

                // Moda
                var moda_val = Mo;

                $("#mean_result").text(_X);
                $("#median_result").text(Me);
                $("#moda_result").text(moda_val);
                $("#n_value").text(data.length);
                $("#c_value").text(C+" (Mín: "+minval+", Máx: "+maxval+")");
                $("#rol_distr").text(data.sort(function(a,b){return a - b;}).join(', '));
            }
    });

    activa('frm_mi');
    $("#grouped_input td:not(.locked)").attr("contenteditable", true);
    $("#classes_input td:not(.locked)").attr("contenteditable", true);

    $("#grouped_input tbody").on(
        'input', "tr:last td.xi",
        function() {
            addTabbedTableRow();
            $(this).focus();
    }).on('change', 'td.fi', function() {
        reCalcTabbedTable();
    });

    $("#classes_input tbody").on('input', 'tr:last td.fi', function() {
        li = parseFloat($(this).parent().find('td.li').text());
        ls = parseFloat($(this).parent().find('td.ls').text());
        var C = ls - li;
        var newLi = ls;
        var newLs = newLi + C;
        addClassTableRow(newLi, newLs);
        reCalcClassedTable();
    });

    $("#agrupar").click(function() {
        group_raw_data();
    });

    $("#classify").click(function() {
        classify_raw_data();
    });

    $("#add_grouped_row").click(function() {
        addTabbedTableRow();
    });

    $("#add_class_row").click(function() {
        addClassTableRow();
    });

    $("#pop_grouped_row").click(function() {
        if ($("#grouped_input tbody>tr").length > 2)
            $("#grouped_input tbody>tr:last").remove();
    });

    $("#pop_class_row").click(function() {
        if ($("#classes_input tbody>tr").length > 2) {
            $("#classes_input tbody>tr:last").remove();
            reCalcClassedTable();
        }
    });

    $('#abas span').addClass('off')
                   .click(function() {
        activa($(this).attr('id'));
    });

    $("#divisao").change(function() {
        var max = parseFloat($(this).val()) - 1;
        $("#i").attr("max", max);
        $("#range-max").text(max);
        if (parseFloat($("#i").val()) > max)
            $("#i").val(max.toString());
    });
    $("#N,#i").change(function() {
        var n = parseFloat($("#N").val());
        var i = parseFloat($("#i").val());
        var S = parseFloat($("#divisao").val());

        if (n != NaN) {
            $("#vp").show(100);
            $("#valor_procurar").text(n*i/S);
        } else {
            $("#vp").hide(100);
        }
    });
    $("#i").change(function() {
        var max = $(this).attr('max');
        var val = $(this).val();
        $("#range-max").text(max);
        $("#range-val").text(val);
    });
    $("#divisao").change();
    $("#N,#i").change();
});

function calcular(frm) {
    var N    = parseFloat($("#N").val());
    var C    = parseFloat($("#C").val());
    var Div  = parseFloat($("#divisao").val());
    var i    = parseFloat($("#i").val());
    var Li   = parseFloat($("#li").val());
    var FDi  = parseFloat($("#FDi").val());
    var Faca = parseFloat($("#faca").val());

    var res = Li+(C*((N/Div)*i-Faca)/FDi);
    var msg  = i+'º '+$("#divisao option:selected").text() + ": "+res.toFixed(4);
    msgBox.show(msg, 'Resultado');
}

function addTabbedTableRow() {
    $("#grouped_input").append('<tr><td class="xi"></td><td class="fi"></td><td class="fr locked">&nbsp;</td><td class="fac locked">&nbsp;</td><td class="xifi locked">&nbsp;</td></tr>');
    $("#grouped_input td:not(.locked)").attr("contenteditable", true);
    $("#grouped_input tr:last td:first").focus();
}

function addClassTableRow(li, ls, fi) {
    li = (li == undefined) ? '' : roundTo(li, 3);
    ls = (ls == undefined) ? '' : roundTo(ls, 3);
    fi = (fi == undefined) ? '' : roundTo(fi, 3);
    $("#classes_input").append('<tr><td class="li">'+li+'</td><td class="ls">'+ls+'</td><td class="fi">'+fi+'</td><td class="fr locked">&nbsp;</td><td class="fac locked">&nbsp;</td><td class="xi locked">&nbsp;</td><td class="xifi locked">&nbsp;</td></tr>');
    $("#classes_input td:not(.locked)").attr("contenteditable", true);
    $("#classes_input tr:last td:first").focus();
}

function clearRawData() {
    $("#mean_result").text('');
    $("#median_result").text('');
    $("#moda_result").text('');
    $("#n_value").text('');
    $("#c_value").text('');
    $("#rol_distr").text('');
    $("#raw_data").val('').focus();
}

function clearTabbedTable() {
    $("#grouped_input tbody").html("");
    $("#grouped_input tfoot").find('.fi').text('')
                             .end().find('.fr').text('')
                             .end().find('.xifi').text('');
    $('#gr_median_res,#gr_mean_res,#gr_moda_res').text('');
    addTabbedTableRow();
    $("#tb .grouped_res").hide();
}

function clearClassedTable() {
    $("#classes_input tbody").html("");
    $("#classes_input tfoot").find('.fi').text('')
                             .end().find('.fr').text('')
                             .end().find('.xifi').text('');
    $('#cl_median_res,#cl_mean_res,#cl_moda_res').text('');
    addClassTableRow();
    $("#cl .grouped_res").hide();
}

function reCalcTabbedTable() {
    var rows    = $("#grouped_input tbody tr");
    var totFi   = $("#grouped_input tfoot").find('.fi');
    var totFr   = $("#grouped_input tfoot").find('.fr');
    var totXiFi = $("#grouped_input tfoot").find('.xifi');
    var i=0, Xi=[], Fi=[], N = 0, fac = 0, qualitativos=false;
    var data = {};
    tXiFi = 0;
    tFr = 0;

    // Contagem das variáveis
    rows.each(function(i, tr) {
        var tdXi   = tr.firstElementChild;
        var tdFi   = tdXi.nextElementSibling;
        var tdFac  = tdFi.nextElementSibling.nextElementSibling;
        var tdXiFi = tdFac.nextElementSibling;
        qualitativos = isNaN(parseInt(tdXi.textContent));

        var xi = qualitativos ? 1 : parseInt(tdXi.textContent); // Se não é uma variável numérica, usar 1
        var fi = parseInt(tdFi.textContent);
        fac += fi;

        if (!isNaN(xi) && !isNaN(fi)) {
            N = qualitativos ? N+xi : N+fi;
            Xi.push(xi);
            data[tdXi.textContent] = fi; // Para a moda
            tXiFi += xi*fi;
            tdFac.textContent  = fac;
            tdXiFi.textContent = (xi*fi).toString();
        }
        _X = tXiFi/N;
        totFi.text(N);
        totXiFi.text(tXiFi);
    });

    // Calcula a média
    rows.each(function(i, tr) {
        var tdFi = tr.firstElementChild.nextElementSibling;
        var fi   = tdFi.textContent;
        var tdFr = tdFi.nextElementSibling;
        var n    = qualitativos ? parseInt(totXiFi.text()) : parseInt(totFi.text());
        if (!isNaN(fi)) {
            tdFr.textContent = (fi/n).toFixed(4);
            tFr += fi/n;
            Fi.push(fi);
        }
        totFr.text(tFr.toFixed(2));
    });

    if (tFr) {
        // Media
        $("#gr_mean_res").text((tXiFi/parseInt(totFi.text())).toFixed(3));

        // Mediana, não faz m uito sentido para dados qualitativos...
        Me = groupedMedian('grouped_input');
        $('#gr_median_res').text(Me.toFixed(3));

        // Moda
        $('#gr_moda_res').text(moda(data, true));
    }

    $("#tb .grouped_res").show();
}

function reCalcClassedTable() {
    var rows = $("#classes_input tbody tr");
    var i=0, Xi=[], N = 0, qualitativos=false;
    var data = {}, Fi=[], Li=[], Fac=[];
    tXiFi = 0;
    tFr = 0, C=0;

    rows.each(function(i, tr) {
        var tdLi   = tr.firstElementChild;
        var tdLs   = tdLi.nextElementSibling;
        var tdFi   = tdLs.nextElementSibling;
        var tdFr   = tdFi.nextElementSibling;
        var tdFac  = tdFr.nextElementSibling;
        var tdXi   = tdFac.nextElementSibling;
        var tdXiFi = tdXi.nextElementSibling;
        var xi = (parseFloat(tdLi.textContent)+parseFloat(tdLs.textContent))/2;
        C = (parseFloat(tdLs.textContent) - parseFloat(tdLi.textContent));

        var fi = parseInt(tdFi.textContent);
        N = N + fi;
        if (!isNaN(xi) && !isNaN(fi)) {
            tXiFi += xi*fi;
            Li.push(parseFloat(tdLi.textContent));
            Fac.push(N);
            tdFac.textContent  = N;
            tdXi.textContent   = xi> 0.01 ? roundTo(xi, 2) : roundTo(xi,5);
            tdXiFi.textContent = (xi*fi).toFixed(2);
            Xi.push(xi);
            data[xi] = fi; // Para a moda
            $("#classes_input tfoot").find('.fi').text(N);
            $("#classes_input tfoot").find('.xifi').text(tXiFi);
        }
    });

    rows.each(function(i, tr) {
        var tdFi = tr.firstElementChild.nextElementSibling.nextElementSibling;
        var fi   = parseInt(tdFi.textContent);
        var tdFr = tdFi.nextElementSibling;
        var n    = parseInt($("#classes_input tfoot").find('.fi').text());
        if (!isNaN(fi)) {
            tdFr.textContent = (fi/n).toFixed(3);
            tFr += fi/n;
            Fi.push(fi);
        }
    });

    if (tFr) {
        $("#classes_input tfoot").find('.fr').text(tFr.toFixed(2));
        N = $("#classes_input tfoot").find('.fi').text();
        // Media
        $("#cl_mean_res").text((tXiFi/N).toFixed(3));
        // Mediana
        Me = groupedMedian('classes_input');
        $('#cl_median_res').text(Me.toFixed(3));
        // Moda
        var i = Fi.indexOf(Fi.max()); // Índice da classe modal...
        D1 = Math.abs(Fi[i]-Fi[i-1]) || Fi[i]; // diferença com a Fac anterior
        D2 = Math.abs(Fi[i]-Fi[i+1]) || Fi[i]; // diferença com a Fac posterior
        Mo = Li[i] + D1/(D1+D2)*C;
        $('#cl_moda_res').text(Mo.toFixed(2));
    }

    $("#cl .grouped_res").show();
}
