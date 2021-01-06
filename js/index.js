(($)=>{
    $(document).ready(()=>{
        const optionElem = $('.options');
        const firstScreen = $('#first-screen');
        const secondScreen = $('#second-screen');
        const currStepTxt = $('#currStepTxt');
        const nextStepTxt = $('#nextStepTxt');
        const finalStepTxt = $('#finalStepTxt');
        const decisionTxt1 = $('.decision-txt small:nth-child(1)')
        const decisionTxt2 = $('.decision-txt small:nth-child(2)')
        const decisionTxt3 = $('.decision-txt small:nth-child(3)')
        const addressAlert = $('#address-alert');
        const currPageNumberDisplayElem = $('#currPageNum');
        const selectedOptionDisplayElem = $('#selectedOption');
        const addressBlockElement = $('.address-block');
        const serviceTxt = $('#serviceTxt');
        const addressActions = $('.address-actions');
        const addAddressField = $('#addAddressField');
        const toQuoteBtn = $('#toQuote');
        const servicesBlock = $('.services-block');
        const locationPreview = $('#locationPreview');
        const defaultNumberOfAddresses = {
            'DIA': 1,
            'E-LINE': 2,
            'ELAN': 3
        }
        let currentPage = 1;
        let selectedOption = '';
        let totalNumberOfAddressField = 4;
        let addressValues = [];
        const addressPayload = {
            addresses: [],
            service: ''
        }


        for(const option of optionElem){
            $(option).on('click', ()=> gotoPage(2, $(option).find('h5').text().trim()))
        }

        addAddressField.on('click', event=>{
            event.preventDefault();
            totalNumberOfAddressField++;
            appendAddressField(totalNumberOfAddressField)
        });

        toQuoteBtn.on('click', event=>{
            event.preventDefault();
            gotoPage(3)
        })

        $('.bck-scnd-pg').on('click', ()=>gotoPage(1))
        $('#newQuote').on('click', ()=>gotoPage(1))

        let pricingList = [];
        async function gotoPage(toPage, context=''){
            currentPage = toPage;
            context?selectedOption = context:null;
            context?serviceTxt.text(context):null;
            currPageNumberDisplayElem.text(toPage);
            if(toPage === 2){   // address page
                addressPayload.addresses = [];
                addressPayload.service = selectedOption;
                togglePageElements(toPage);
                initializeAddressElements();
            }else if(toPage === 3){   // quote page
                servicesBlock.empty();

                // TODO: To populate test data
                // togglePageElements(toPage)
                // fetchServices1()

                // TODO: Uncomment next lines to populate needed real data
                pricingList = [];
                let response = await fetchPricingList(JSON.stringify(addressPayload))
                if(response){
                    pricingList = response.pricing_list;
                    togglePageElements(toPage)
                    fetchServices(response.pricing_list)
                }
            }else{
                togglePageElements(toPage)
            }
        }

        function togglePageElements(page=1){
            if(page === 1){
                $('.hero-side').fadeIn();
                $('.extra').fadeOut()
                secondScreen.fadeOut('fast');
                nextStepTxt.fadeOut('fast');
                decisionTxt2.fadeOut('fast')
                addressAlert.fadeOut('fast');
                addressActions.fadeOut('fast');
                addAddressField.fadeOut('fast');
                finalStepTxt.fadeOut('fast')
                decisionTxt3.fadeOut('fast')
                addressBlockElement.empty();
                servicesBlock.empty();

                firstScreen.fadeIn('slow');
                currStepTxt.fadeIn('slow');
                decisionTxt1.fadeIn('slow');
                optionElem.fadeIn('slow');

            }else if(page === 2){
                if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
                   $('.hero-side').fadeOut();
                   $('.extra').fadeIn()
                }
                selectedOptionDisplayElem.text(`${selectedOption} installations require ${defaultNumberOfAddresses[selectedOption]===1?'only': ''} ${defaultNumberOfAddresses[selectedOption]} ${defaultNumberOfAddresses[selectedOption]>=3?'or more': ''} address${defaultNumberOfAddresses[selectedOption]>1?'es': ''}`)
                firstScreen.fadeOut('fast');
                currStepTxt.fadeOut('fast');
                decisionTxt1.fadeOut('fast');
                optionElem.fadeOut('fast');
                defaultNumberOfAddresses[selectedOption]>=3? addAddressField.fadeIn('slow'):addAddressField.fadeOut('slow');
                locationPreview.text('');
                addressValues = [];


                secondScreen.fadeIn('slow');
                nextStepTxt.fadeIn('slow');
                decisionTxt2.fadeIn('slow').css('display', 'block');
                addressAlert.fadeIn('slow');
                addressActions.fadeIn('slow')
            }else if(page === 3){
                nextStepTxt.fadeOut('fast');
                decisionTxt2.fadeOut('fast');
                addressAlert.fadeOut('fast');
                addressActions.fadeOut('fast');
                addressBlockElement.empty();

                finalStepTxt.fadeIn('slow')
                decisionTxt3.fadeIn('slow').css('display', 'block');
                if(addressPayload.addresses.length > 0){
                    const tmp_list =  addressValues.map((address, index)=>`#${index+1}. ${address}`);
                    locationPreview.html(tmp_list.join('<br>'))
                }else{
                    locationPreview.text('')
                }
            }
        }
        function initializeAddressElements(){
            // const numberOfAddressFields = addressBlockElement.children().length;
            // if(numberOfAddressFields > 0){  // already initialized
            //     addressBlockElement.empty();
            // }
            addressBlockElement.empty();
            for(let count=0; count < defaultNumberOfAddresses[selectedOption]; count++){
                appendAddressField(count)
            }
        }
        function appendAddressField(fieldCount){
            addressBlockElement.append(`
                    <div class="col-12">
                                <div class="w-100 mb-2">
                                    <span class="badge badge-light p-2 text-muted"> <img src="./images/icons/building.png" alt="line"> Address ${fieldCount+1}</span>
                                </div>
                                <input class="form-control" type="text" id="address_${fieldCount}" placeholder="Enter a building address">
                            </div>
                    `);
            addressPayload.addresses.push({
                address: '',
                longitude: 0,
                latitude: 0
            })
            let input = document.getElementById('address_'+fieldCount);
            let autocomplete = new google.maps.places.Autocomplete(input);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                let place = autocomplete.getPlace();
                $('#address_'+fieldCount).val(place.formatted_address)
                addressPayload.addresses[fieldCount].address = place.formatted_address;
                addressPayload.addresses[fieldCount].latitude = place.geometry.location.lat();
                addressPayload.addresses[fieldCount].longitude = place.geometry.location.lng();
            });
        }
        async function fetchPricingList(payload){
            let response = null;
            try {
                response = await $.post('http://d18ff7b554b7.ngrok.io/quote/get_addresses/',
                    payload,
                    (data)=>{
                        response = data;
                        // console.log('Response Data:', data)
                    })
            }catch (e) {
                toastr.error(e.message, "Unable to complete request")
            }
            return response
        }
        let selectedPricing = {}
        $('#getQuote').on('click', async (event)=>{
            event.preventDefault();
            let response = await submitQuote()
            if(response){
                $('#quoteRequest').modal('hide');
                setTimeout(()=>{
                    $('#quote_id').text(response.quote_id);
                    $('#quote_msg').text(response.message);
                    $('#quoteDone').modal('show');
                }, 1000)
            }
        })
        function fetchServices(pricing_list=[]){
            // console.log('appending payload:', pricing_list)
            for(let i=0; i<pricing_list.length;i++){
                servicesBlock.append(`
                <div class="col-12 col-md-6 mb-2">
                                    <div class="card">
                                        <div class="card-body px-0">
                                            <div class="float-left text-center mx-2 icon">
                                                <img src="./images/icons/building.png" alt="line">
                                            </div>
                                            <div class="float-right">
                                                <h5 class="text-muted px-3">${pricing_list[i].bandwidth}Mb</h5>
                                            </div>
                                            <h5 class="card-title px-3 text-muted">IP Services</h5>
                                            <h6 class="card-subtitle mb-2 text-muted font-weight-bolder px-3">${pricing_list[i].service}</h6>
                                            <h4 class="card-text p-3 text-center">
                                                $${pricing_list[i].min_cost} - $${pricing_list[i].max_cost}
                                            </h4>
                                            <div class="row justify-content-center align-content-center">
                                                <a id="pricing_${i}" href="javascript:void(0)" class="text-muted pt-2 font-weight-bolder" data-toggle="modal" data-target="#quoteRequest">
                                                    <img src="./images/icons/envelop.png" alt="line">&nbsp;GET QUOTE
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                `);
                $(`#pricing_${i}`).on('click', function () {
                    selectedPricing = pricingList[i];
                    $('#s_service_txt').text(selectedPricing.service);
                    $('#s_bandwidth').text(`${selectedPricing.bandwidth}Mb`);
                    $('#s_price_range').text(`$${selectedPricing.min_cost}-$${selectedPricing.max_cost}`);
                    $('#quoteRequest').modal('show')
                })
            }
        }
        async function submitQuote(){
            const full_name = $('#fullname').val();
            const company_name = $('#compname').val();
            const phone = $('#phone').val();
            const email = $('#email').val();
            let response;
            if(!full_name || !company_name || !phone || !email){
                toastr.warning("Please complete all fields")
            }else if(!validateEmail(email)){
                toastr.warning("Invalid email address")
            }else{
                try {
                    response = await $.post('http://d18ff7b554b7.ngrok.io/quote/send_quote/',
                        JSON.stringify({
                            email,
                            full_name,
                            ...selectedPricing
                        }),
                        (data)=>{
                            response = data;
                            // console.log('Response Data:', data)
                        })
                    // response = { quote_id : 5672}   // remove: test response
                }catch (e) {
                    toastr.error(e.message, "Unable to complete request");
                }
            }
            return response
        }
        function validateEmail(mail){
            return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)
        }

        function fetchServices1(){
            for(let i=0; i<6;i++){
                servicesBlock.append(`
                <div class="col-12 col-md-6 mb-2">
                                    <div class="card">
                                        <div class="card-body px-0">
                                            <div class="float-left text-center mx-2 icon">
                                                <i class="fa fa-building"></i>
                                            </div>
                                            <div class="float-right">
                                                <h5 class="text-muted px-3">50Mb</h5>
                                            </div>
                                            <h5 class="card-title px-3 text-muted">IP Services</h5>
                                            <h6 class="card-subtitle mb-2 text-muted font-weight-bolder px-3">${selectedOption}</h6>
                                            <h4 class="card-text p-3 text-center">
                                                $480 - $650
                                            </h4>
                                            <div class="row justify-content-center align-content-center">
                                                <a href="javascript:void(0)" class="text-muted pt-2 font-weight-bolder" data-toggle="modal" data-target="#quoteRequest">
                                                    <i class="fa fa-envelope"></i>&nbsp;GET QUOTE
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                `)
            }
        }
    })
})(window.jQuery)