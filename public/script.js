async function analyzeRepo() {
    const repoUrl = document.getElementById("repoUrl").value;

    const loading =document.getElementById("loading");
    const result=document.getElementById("result");

    loading.style.display="block";
    result.innerText="";

    const res=await fetch("/analyze",{
        method:"POST",

        headers:{
            "Content-type":"application/json"
        },

        body:JSON.stringify({repoUrl})
    });

    const data=await res.json();

    loading.style.display="none";

    result.innerText=data.result;
}