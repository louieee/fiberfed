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
        let totalNumberOfAddressField = 3;
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
                                    <span class="badge badge-light p-2 text-muted"> <i class="fa fa-building"></i> Address ${fieldCount+1}</span>
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
                response = await $.post('http://8ed4303a7e71.ngrok.io/quote/get_addresses/',
                    payload,
                    (data)=>{
                        response = data;
                        console.log('Response Data:', data)
                    })
            }catch (e) {
                toastr.error(e.message, "Unable to complete request")
            }
            console.log('Returned Response:', response)
            return response
        }
        let selectedPricing = {}
        $('#getQuote').on('click', async (event)=>{
            event.preventDefault();
            let response = await submitQuote()
            if(response){
                $('#quoteRequest').modal('hide');
                setTimeout(()=>{
                    $('#quote_id').text(response.quote_id)
                    $('#quoteDone').modal('show');
                }, 1000)
            }
        })
        function fetchServices(pricing_list=[]){
            for(let i=0; i<pricing_list;i++){
                servicesBlock.append(`
                <div class="col-12 col-md-6 mb-2">
                                    <div class="card">
                                        <div class="card-body px-0">
                                            <div class="float-left text-center mx-2 icon">
                                                <i class="fa fa-building"></i>
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
                                                    <i class="fa fa-envelope"></i>&nbsp;GET QUOTE
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                `);
                $(`#pricing_${i}`).on('click', function () {
                    selectedPricing = pricingList[i];
                    $('#s_service_txt').text(selectedPricing.service);
                    $('#s_bandwidth').text(selectedPricing.bandwidth);
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
                    response = await $.post('http://8ed4303a7e71.ngrok.io/quote/send_quote/',
                        JSON.stringify({
                            email,
                            full_name,
                            ...selectedPricing
                        }),
                        (data)=>{
                            response = data;
                            console.log('Response Data:', data)
                        })
                    response = { quote_id : 5672}   // remove: test response
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