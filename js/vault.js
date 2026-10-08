// логика пароля и разблокировки

var VAULT_PASSWORD = "7465";

function unlockVault(){
  var input = document.getElementById('pwInput');
  var err = document.getElementById('pwErr');
  var vault = document.getElementById('vault');
  var status = document.getElementById('vaultStatus');
  if (!input || !vault) return;

  if (input.value === VAULT_PASSWORD){
    vault.classList.add('unlocked');
    status.textContent = 'РАЗБЛОКИРОВАНО';
    err.classList.remove('show');
    input.value = '';
  } else {
    err.classList.add('show');
    input.value = '';
    input.focus();
  }
}

function lockVault(){
  var vault = document.getElementById('vault');
  var status = document.getElementById('vaultStatus');
  var err = document.getElementById('pwErr');
  var input = document.getElementById('pwInput');
  if (!vault) return;

  vault.classList.remove('unlocked');
  status.textContent = 'ЗАБЛОКИРОВАНО';
  err.classList.remove('show');
  input.value = '';
  input.focus();
}

document.addEventListener('DOMContentLoaded', function(){
  var pw = document.getElementById('pwInput');
  if (pw){
    pw.addEventListener('keydown', function(e){
      if (e.key === 'Enter') unlockVault();
    });
  }
});