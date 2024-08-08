/* 로그인 컴포넌트 */
import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import { Modal } from "react-bootstrap";

function Login() {

	const { auth, setAuth } = useContext(AuthContext);
	const { headers, setHeaders } = useContext(HttpHeadersContext);

	const [passwdToken, setToken] = useState(localStorage.getItem("ptap"));
	const [btnAbled, setAbled] = useState(false);

	const navigate = useNavigate();

	const [id, setId] = useState("");
	const [pwd, setPwd] = useState("");
	const [show, setShow] = useState(false);

	const changeId = (event) => {
		setId(event.target.value);
	}

	const changePwd = (event) => {
		setPwd(event.target.value);
	}

	const login = async () => {
		const req = {
			id: id,
			pwd: pwd
		}

		fetch(`/api/users/login/token`,{
			method: "POST",
			headers: {
				'accept': ' application/json',
				'Content-Type': ' application/x-www-form-urlencoded',
			},
			body: `grant_type=&username=${id}&password=${pwd}&scope=&client_id=&client_secret=`
		})
		.then(res=>{
			console.log(res);
			if(res.status === 200){
				return res.json();
			}
			return false;
		})
		.then(data=>{
			if(data){
				// JWT 토큰 저장
				localStorage.setItem("bbs_access_token", data.token_type);
				localStorage.setItem("id", data.username);
				setAuth(data.username);
				setHeaders({"Authorization": `${data.token_type} ${data.access_token}`}); // 헤더 Authorization 필드 저장
				navigate("/bbslist");
			}
			else{
				alert("아이디 또는 비밀번호가 틀립니다.");
				localStorage.setItem("ptap", Number(passwdToken)+1);
				setToken(Number(passwdToken)+1);
			}
		})
		.catch((err) => {
			console.log("[Login.js] login() error :<");
			console.log(err);

			alert("⚠️ " + err.response.data);
		});
	}

	useEffect(()=>{
		if(passwdToken === null){
			setAbled(true);
			setShow(true);
		}
		else if(0>Number(passwdToken) || Number(passwdToken)>4){
			setAbled(true);
			setShow(true);
		}
	}, [passwdToken])

	return (
		<div>
			<table className="table">
				<tbody>
					<tr>
						<th className="col-3"onClick={()=>setShow(true)}>아이디</th>
						<td>
							<input type="text" value={id} onChange={changeId} size="50px" />
						</td>
					</tr>

					<tr>
						<th onClick={()=>{
						}}>비밀번호</th>
						<td>
							<input type="password" value={pwd} onChange={changePwd} size="50px" />
						</td>
					</tr>
				</tbody>
			</table><br />

			<div className="my-1 d-flex justify-content-center">
				<button className="btn btn-outline-secondary" onClick={login} disabled={btnAbled}><i className="fas fa-sign-in-alt"></i> 로그인</button>
			</div>
			<Qwer show={show} handle={setShow} activebtn={setAbled}/>
		</div>
	);
}

export default Login;

function Qwer({show, handle, activebtn}){
	const [qwerasdf, zxcv] = useState(false);

	function showMyCaptcha() {
        console.log("on click");
        var container = document.querySelector("#my-captcha-container");
        
        window.AwsWafCaptcha.renderCaptcha(container, {
			apiKey: "DrONymZXRld0vRCmr056nNS6hF+3DusCQmHCgSXuqm1wTxgJIfGTlaPGuawK5HiR0wOlLPa6+p6w423PavDvsQO7gvmntdQehrQpl1LERHiN/d4x3rMNmknl1PkOPOJVTDVbSMqfqGnuqGotsa9pPo5R3BkSy8GqaSMRzzek3cEzofpDq7SvAzPtyumhpUXMzG3RdriFrnUuNSNHHeQUTmobBVUolz+LNFClWUx6PKsqdP42rqxXUYJiSgm+SlkGcNKBagIcqwJYmfeODi0G/ik3iemBT4BxAPJ575HBXpDOwrX9pKGSJTAr3veexrZwVD23tCYtyCWtogfITGI6194Qcci7z34M13HTPmFpSH/WdlK+rwLv98Sy0dJrHFMyHKaah2iMjWItvR18F2k/Jj4GeHQLD4Fk+fROZUffE7FqOtzJ6HxNgMwMt1EmooZsexwDjgWds6gU+7YF3z26PAmmIJw3hxbeeBGTTG/SBjvBIxsYhEtRANQYPG1wHOzxDPWVwuSkKnpcnjf/mBP6obryMSIBzLAkm/SknPeUx9LmohbVrW/ULgqWdjLzJ+cJIMXyIoXUHuLUY9Cy1Ys97OzqMbZXIS8EoKcVkSOPx7hmgkrTx61usioDSxqVmkTwHZfXRBPXhep6EGDOiMdmVfFhZMNEap8emgFabFKXHK4=_0_1",
			onSuccess: captchaSuccess,
			onError: captchaError,
			disableLanguageSelector: true,
			dynamicWidth: true, 
			skipTitle: true
		});
	}

	function captchaSuccess(){
		localStorage.setItem("ptap", 0);
		activebtn(false);
		handle(false);
	}
	function captchaError(){
		alert("인터넷 접속을 확인해주세요");
	}
	
	useEffect(()=>{
		if(show){
			if(qwerasdf){
				zxcv(true)
			}
			else{
				setTimeout(() => {
					showMyCaptcha();
				}, 1000);
			}
		}
	},[qwerasdf, show])
	return (
		<Modal show={show}>
			<Modal.Body>
				<div id="my-captcha-container" onLoad={console.log("a")}>loading...</div>
			</Modal.Body>
		</Modal>
	)
}