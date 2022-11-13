import { useEffect } from 'react';

import { useHtml5QrCodeScanner } from 'react-html5-qrcode-reader';
let rendered = false;

function YourComponent({ update }: { update: (data: string) => void }) {
    const { Html5QrcodeScanner } = useHtml5QrCodeScanner('html5-qrcode.min.js');
    if (Html5QrcodeScanner && !rendered) {
        rendered = true;
        console.log('got it');

        // Creates anew instance of `HtmlQrcodeScanner` and renders the block.
        let html5QrcodeScanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } }, /* verbose= */ false);

        html5QrcodeScanner.render(
            (data: any) => {
                update(data);
            },
            (err: any) => console.log('err ->', err),
        );
    }

    // beware: id must be the same as the first argument of Html5QrcodeScanner
    return <div id="reader" className="max-h-[300px]" style={{ maxHeight: '300px' }}></div>;
}
export default YourComponent;
