import { verifyPresentation } from 'did-jwt-vc';
import { Resolver } from 'did-resolver';
import Settings from '../src/config/settings.json';
import './App.css';


var ethrDid = require('ethr-did-resolver').getResolver({ rpcUrl: Settings.HTTP_PROVDER });
var ethrResolver = new Resolver(ethrDid);

function Header() {
  return (
    <h1>Verifier App</h1>
  );
}

function VerifiablePresentationInputField() {
  return (
    <div class="col">
      <input type="text" class="form-control" id="received_presentation" placeholder="Enter verifiable presentation" />
    </div>
  );
}

function VerificationButton() {
  return (
    <div class="col-3">
      <button type="button" class="btn btn-primary btn-block" onClick={VerifyPresentation}>Verify</button>
    </div>
  );
}

function VerificationResult() {
  return (
    <div class="row">
      <div class="col"><h2 id="verification_result"></h2></div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div class="container">
        <Header/>
        <div class="row">
          <VerifiablePresentationInputField />
          <VerificationButton />
        </div>
        <VerificationResult />
      </div>
    </div>
  );
}

async function VerifyPresentation() {
  var receivedVP = document.getElementById('received_presentation').value;
  var result;

  try {
    result = await verifyPresentation(receivedVP, ethrResolver);
  } catch (error) {
    result = "Invalid";
  }

  if (typeof (result) != 'undefined' && result !== "Invalid") {
    result = "Valid";
    document.getElementById('verification_result').style.color = 'green';
  } else {
    result = "Invalid";
    document.getElementById('verification_result').style.color = 'red';
  }

  document.getElementById('verification_result').textContent = result;
}

export default App;
