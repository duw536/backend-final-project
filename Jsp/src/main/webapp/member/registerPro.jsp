<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="member.MemberDAO" %>
<%@ page import="member.MemberVO" %>
<% request.setCharacterEncoding("UTF-8"); %>
<%
    response.setContentType("application/json");
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); 
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    String id = request.getParameter("id");
    String password = request.getParameter("password");
    String name = request.getParameter("name");
    String email = request.getParameter("email");

    MemberVO mb = new MemberVO();
    mb.setId(id);
    mb.setPassword(password);
    mb.setName(name);
    mb.setEmail(email);

    MemberDAO mdao = MemberDAO.getInstance();
    int result = mdao.register(mb);

    if (result == 1) {
        response.setStatus(HttpServletResponse.SC_OK);
        out.print("{\"message\": \"success\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"error\", \"detail\": \"회원가입에 실패했습니다.\"}");
    }
%>