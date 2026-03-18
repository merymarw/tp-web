const ddn = document.getElementById('ddn');
const max = new Date();
max.setFullYear(max.getFullYear() - 18);
ddn.max = max.toISOString().split('T')[0];

const pw = document.getElementById('password');
const confirm = document.getElementById('confirm');

confirm.addEventListener('input', function () {
    this.setCustomValidity(this.value !== pw.value ? 'Erreur mot de passe' : '');
});

document.getElementById('form').addEventListener('submit', function (e) {
    if (!this.checkValidity()) {
        e.preventDefault();
        this.reportValidity();
    }
});
