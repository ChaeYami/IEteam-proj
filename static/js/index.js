// 프로필사진 클릭 시 각 멤버 상세페이지로 이동 (팝업으로 띄우기)
function go_detail_page(name) {

    //창 크기 지정
    let width = 1200;
    let height = 900;
    //pc화면기준 가운데 정렬
    let left = (window.screen.width / 2) - (width / 2);
    let top = (window.screen.height / 4);

    //윈도우 속성
    let windowStatus = 'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top + ', scrollbars=yes, status=yes, resizable=yes, titlebar=yes';

    //연결하고싶은url
    const url = `${name}`;

    //등록된 url 및 window 속성 기준으로 팝업창을 연다.
    window.open(url, "hello popup", windowStatus);

}
// function go_detail_page(name) {
//     window.open(`${name}`, '_blank');
// }



// =================== 방명록 쓰기 =================== 
/* function save_comment() {



    let nickname = $('#nickname').val();
    let comment = $('#comment').val();
    let pw = $('#pwds').val();

    

    let formData = new FormData();
    formData.append("nickname_give", nickname);
    formData.append("comment_give", comment);
    formData.append("pw_give", pw);

    fetch('/writegb', { method: "POST", body: formData, })
        .then((res) => res.json())
        .then((data) => {
            alert(data["msg"]);
            window.location.reload()

        });
} */
// =================== 전체 방명록 조회 =================== 
function show_all_comment() {

    fetch('/guestbook', {})
        .then((res) => res.json())
        .then((data) => {
            let rows = data['result']
            $('#comment-list').empty()
            rows.forEach((a) => {
                let nickname = a['nickname']
                let comment = a['comment']
                let name = a['member_name']
                let temp_html = `
                    <div class="card" id = "home_card">
                        <div class="card-body">
                        <blockquote class="blockquote mb-0">
                        <p>To. ${name}</p>
                            <p style="font-weight: bold; font-size: 20px;">${comment}</p>
                            <footer class="blockquote-footer">${nickname}</footer>
                            </blockquote>
                        </div>
                    </div>
                `

                $('#comment-all-list').append(temp_html)


            })

        })
} 


//  =================== 개인 방명록 작성 =================== 
function save_comment(name) {
    let nickname = $('#nickname').val()
    let comment = $('#comment').val()
    let pw = $('#pwds').val()

    let formData = new FormData();
    formData.append("nickname_give", nickname);
    formData.append("comment_give", comment);
    formData.append("member_name_give", name);
    formData.append("pwd_give", pw);

    if(nickname.trim() == ''){
        alert('닉네임을 입력해주세요.')
    }else if(comment.trim() == ''){
        alert('내용을 입력해주세요.')
    }else if(pw.trim() == ''){
        alert('비밀번호를 입력해주세요.')
    }else{
        fetch('/writegb', { method: "POST", body: formData,})
        .then((res) => res.json())
        .then((data) => {
            alert(data["msg"]);
            window.location.reload()
        });
    }
}

/* function save_comment(name) {
    let nickname = $('#nickname').val()
    let comment = $('#comment').val()
    let pw = $('#pwds').val()

    if(nickname.trim() == ''){
        alert('닉네임을 입력해주세요.')
    }else if(comment.trim() == ''){
        alert('내용을 입력해주세요.')
    }else if(pw.trim() == ''){
        alert('비밀번호를 입력해주세요.')
    }else{
        $.ajax({
            type: 'POST',
            url: '/writegb',
            data: {
                nickname_give: nickname,
                comment_give: comment,
                member_name_give: member_name,
                pwd_give: pw
            },
            success: function (data) {
                alert(data['msg'])
                window.location.reload()
            }
        })
    }
} */
// =================== 개인 방명록 조회 =================== 
function show_comment(name) {
    let member_name = name
    formData = new FormData();
    formData.append("member_name_give", member_name);

    fetch('/guestbookmem', { method: "POST", body: formData, })
        .then((res) => res.json())
        .then((data) => {
            let rows = data['result']
            $('#comment-list').empty()
            // let member_name = rows['member_name']

            rows.forEach((a, index) => {
                let nickname = a['nickname']
                let comment = a['comment']
                let idx = a['idx']


                let temp_html = `
                    <div class="card">
                        <div class="card-body">
                        <blockquote class="blockquote mb-0">
                            <p style="font-weight: bold; font-size: 20px;">${comment}</p>
                            <footer class="blockquote-footer">${nickname}</footer>
                            </blockquote>


                            <div class="input_pw">
                                <input type="password" id="pw${index}" placeholder="비밀번호" maxlength="6">
                                <button class="del" onclick="del_check(${idx}, ${index})">삭제</button>
                            </div>

                            
                        </div>
                    </div>
                `
                $('#comment-list').append(temp_html)
            })
        })
}



function del_box(idx) {
    $.ajax({
        type: "DELETE",
        url: "/delete",
        data: { 'idx_give': idx },
        success: function (response) {
            alert(response["msg"])
            console.log(response)
            window.location.reload()
        }
    });
};


function del_check(idx, index) {
    let pwd = $("#pw" + index).val();
    console.log("idx : " + idx)
    //console.log(result)
    $.ajax({
        type: "GET",
        url: "/guestbook",
        data: {
            'idx_give': idx
        },
        success: function (response) {
            idx_result = response.result
            //console.log(idx_result)
            //console.log(idx_result)
            for (let i = 0; i < idx_result.length; i++) {
                let poem = idx_result[i];
                let poem_idx = poem.idx
                if (idx == poem_idx) {
                    let poem_password = poem.pw
                    if (pwd == poem_password) {
                        del_box(idx)
                    } else {
                        alert('비밀번호를 확인해주세요')
                    }
                }
            };
            //window.location.reload()
        }
    });
};