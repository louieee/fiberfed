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
        let addressValues = []


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

        function gotoPage(toPage, context=''){
            currentPage = toPage;
            context?selectedOption = context:null;
            context?serviceTxt.text(context):null;
            currPageNumberDisplayElem.text(toPage);
            togglePageElements(toPage)
            if(toPage === 2){   // address page
                initializeAddressElements()
            }else if(toPage === 3){   // quote page
                servicesBlock.empty();
                fetchServices()
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
                if(addressValues.length > 0){
                    const tmp_list =  addressValues.map((address, index)=>`#${index}. ${address}`);
                    tmp_list.shift();   // indexing is from one not zero
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
            for(let count=1; count <= defaultNumberOfAddresses[selectedOption]; count++){
                appendAddressField(count)
            }
        }
        function appendAddressField(fieldCount){
            addressBlockElement.append(`
                    <div class="col-12">
                                <div class="w-100 mb-2">
                                    <span class="badge badge-light p-2 text-muted"> <i class="fa fa-building"></i> Address ${fieldCount}</span>
                                </div>
                                <input class="form-control" type="text" id="address_${fieldCount}" placeholder="Enter a building address">
                            </div>
                    `);
            $('#address_'+fieldCount).on('input', function(event){
                addressValues[fieldCount] = $(this).val();
            })
        }
        function fetchServices(){
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
                                                <a href="#" class="text-muted pt-2 font-weight-bolder">
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