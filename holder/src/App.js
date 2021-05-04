import './App.css';
import { createVerifiablePresentationJwt } from 'did-jwt-vc';
import { decodeJWT } from 'did-jwt';
import Settings from '../src/config/settings.json';
import QRCode from 'qrcode';
import EthrDID from 'ethr-did';
import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider(Settings.HTTP_PROVDER)
const ethrDid = new EthrDID({
  address: Settings.WALLET_ADDRESS,
  privateKey: Settings.WALLET_PRIVATE_KEY,
  provider: provider
})

var selectedCredential = 0
var storedCredentials = []

function Header() {
  return (<h1>Patient App</h1>);
}

function InputPatientDIDField() {
  return (
    <div class="row">
      <div class="col-2"><label>Patient DID:</label></div>
      <div class="col"><input type="text" value={ethrDid.did} class="form-control" id="holder_did" readOnly /></div>
    </div>
  );
}

function ImportVerifiableCredentialForm() {
  return (
    <div class="row">
      <div class="col">
        <input type="text" class="form-control" id="vaccine_jwt" placeholder="Enter verifiable credential" />
      </div>
      <div class="col-3">
        <button type="button" class="btn btn-primary btn-block" onClick={ImportVerifiableCredential}>Import</button>
      </div>
    </div>
  );
}

function VerifiableCredentialsList() {
  return (
    <div class="row">
      <div class="col-2"><label>Stored Verifications:</label></div>
      <div class="col">
        <select id="stored_verifications" class="form-control" onChange={e => selectedCredential = e.target.options.selectedIndex}>
          {storedCredentials.map(e => (
            <option value={e}>{decodeJWT(e)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function IssueVerifiablePresentationButton() {
  return (
    <div class="row">
      <div class="col"><button id="issue_button" class="btn btn-primary btn-lg btn-block" onClick={IssuePresentation}>Display Verification</button></div>
    </div>
  );
}

function IssuedVerifiablePresentationDisplay() {
  return (
    <div class="row">
      <div class="col">
        <canvas id="canvas"></canvas>
        <input type="text" class="form-control" id="issued_vp" readOnly hidden />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div class="container">
        <Header />
        <InputPatientDIDField />
        <ImportVerifiableCredentialForm />
        <VerifiableCredentialsList />
        <IssueVerifiablePresentationButton />
        <IssuedVerifiablePresentationDisplay />
      </div>
    </div>
  );
}

async function IssuePresentation() {
  const vpPayload = {
    vp: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [storedCredentials[selectedCredential]]
    }
  }

  const vpJWT = await createVerifiablePresentationJwt(vpPayload, ethrDid)
  document.getElementById('issued_vp').value = vpJWT
  document.getElementById('issued_vp').hidden = false
  var canvas = document.getElementById('canvas')

  QRCode.toCanvas(canvas, vpJWT, function (error) {
    if (error) console.error(error)
  })
}

function ImportVerifiableCredential() {
  const jwt = document.getElementById('vaccine_jwt').value

  if (jwt === "" || typeof (jwt) == "undefined") {
    alert('No JWT provided!')
  } else {
    if (!storedCredentials.includes(jwt)) {
      storedCredentials.push(jwt);
      var select = document.getElementById("stored_verifications");
      var option = document.createElement("option");
      option.value = jwt;

      let vaccine = decodeJWT(jwt).payload.vc.credentialSubject.vaccine
      console.log(vaccine)
      option.innerHTML = "(" + vaccine.type + ") " + vaccine.manufacturer;
      select.appendChild(option);
    }
  }
}

export default App;
