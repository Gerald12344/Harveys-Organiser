import { useRef } from 'react';
import { useHtml5QrCodeScanner } from 'react-html5-qrcode-reader';

let rendered = false;

function BarcodeComponent({ update }: { update: (data: string) => void }) {
    const audiorref = useRef<HTMLAudioElement>(null);
    const { Html5QrcodeScanner } = useHtml5QrCodeScanner('html5-qrcode.min.js');
    if (Html5QrcodeScanner && !rendered) {
        rendered = true;
        console.log('got it');

        // Creates anew instance of `HtmlQrcodeScanner` and renders the block.
        let config = {
            fps: 10,
            qrbox: {
                width: 300,
                height: 300,
            },
        };
        let html5QrcodeScanner = new Html5QrcodeScanner('reader', config, /* verbose= */ false);

        html5QrcodeScanner.render(
            (data: any) => {
                if (audiorref.current) {
                    audiorref.current.play();
                }
                update(data);
            },
            (err: any) => console.log('err ->', err),
        );
    }

    return (
        <>
            <audio id="audio" src="Sound.wav" ref={audiorref} />
            <div id="reader" className="max-h-[300px]" style={{ maxHeight: '300px' }}></div>
        </>
    );
}
export default BarcodeComponent;
