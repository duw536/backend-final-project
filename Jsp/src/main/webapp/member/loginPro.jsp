<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="member.MemberDAO" %>
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

    MemberDAO mdao = MemberDAO.getInstance();
    int result = mdao.login(id, password);

    if (result == 1) {
        int uid = mdao.getUidById(id);
        session.setMaxInactiveInterval(60 * 30);
        session.setAttribute("userID", id);
        session.setAttribute("uid", uid);
        response.setStatus(HttpServletResponse.SC_OK);
        out.print("{\"message\": \"success\", \"uid\": " + uid + ", \"name\": \"" + id + "\"}");
    } else if (result == 0) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        out.print("{\"message\": \"error\", \"detail\": \"비밀번호가 일치하지 않습니다.\"}");
    } else if (result == -1) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        out.print("{\"message\": \"error\", \"detail\": \"존재하지 않는 아이디입니다.\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"error\", \"detail\": \"데이터베이스 오류가 발생했습니다.\"}");
    }
%>