var msgChartList;
var popupChartList;

$(function () {

	//TAB 이벤트 등록
	$('a[href="#msgSection"]').click(function(e) {
		$('a[href="#msgSection"]').parent().addClass('active');
		$('a[href="#popupSection"]').parent().removeClass('active');
		$('#msgSection').show();
		$('#popupSection').hide();
		showChart('container', msgChartList);
	})
	$('a[href="#popupSection"]').click(function(e) {
		$('a[href="#popupSection"]').parent().addClass('active');
		$('a[href="#msgSection"]').parent().removeClass('active');
		$('#popupSection').show();
		$('#msgSection').hide();
		showChart('container2', popupChartList);
	})
	
    $(document).ready(function () {
    	var list;
    	var chartList;
    	
    	// chart에 들어갈 값 ajax로 받아오기
    	$.ajax({
			url : './clickChart.do',
			method : 'POST',
			dataType : 'json',
			data : {
				camp_id : $('#container').attr('campId')
			},
			success : function(result) {
				//메시지 클릭수 차트 데이터 준비
				list = JSON.parse(result.msgList);
				chartList = [];
				for (var i = 0; i < list.length; i++) {
			    	var chartItem = {};
			    	
			    	// 링크 갯수가 10개 이상이면 링크 주소 대신 시퀀스로 표현
			    	if (list.length > 10) {
			    		chartItem.name = list[i].linkSeq;
			    	} else {

			    		// 링크 주소가 30자 이상이면 잘라서 '...' 으로 표현
			    		if (list[i].linkAddr.length > 30) {
			    			chartItem.name = list[i].linkSeq + '. '
			    				+ list[i].linkAddr.substring(0, 30) + '...';
			    		} else {
			    			chartItem.name = list[i].linkSeq + '. ' + list[i].linkAddr;
			    		}
			    		
			    	}
			    	chartItem.y = list[i].clickCnt;
			    	chartList.push(chartItem);
				}
				showChart('container', chartList);
				msgChartList = chartList;
				
				//팝업 클릭수 차트 데이터 준비
				list = JSON.parse(result.popupList);
				chartList = [];
				for (var i = 0; i < list.length; i++) {
			    	var chartItem = {};
			    	
			    	// 링크 갯수가 10개 이상이면 링크 주소 대신 시퀀스로 표현
			    	if (list.length > 10) {
			    		chartItem.name = list[i].linkSeq;
			    	} else {
			    		
			    		// 링크 주소가 30자 이상이면 잘라서 '...' 으로 표현
			    		if (list[i].linkAddr.length > 30) {
			    			chartItem.name = list[i].linkSeq + '. '
			    				+ list[i].linkAddr.substring(0, 30) + '...';
			    		} else {
			    			chartItem.name = list[i].linkSeq + '. ' + list[i].linkAddr;
			    		}
			    		
			    	}
			    	chartItem.y = list[i].clickCnt;
			    	chartList.push(chartItem);
				}
				showChart('container2', chartList);
				popupChartList = chartList;
			},
			error : function(e) {
				console.error('ajax 에러: ' + e.status);
			}
		});
    });
});



// 차트 보여주기(인자: 객체배열)
function showChart(target, chartData) {
	var targetContainer = '#' + target;
    $(targetContainer).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '클릭 횟수 비교'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y} 건</b> (<b>{point.percentage:.1f}%</b>)'
        },
        credits : {
        	enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: '클릭 비율',
            colorByPoint: true,
            data: chartData
        }]
    });
}