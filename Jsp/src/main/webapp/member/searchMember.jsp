<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="member.MemberDAO" %>
<%@ page import="member.MemberVO" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");

    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    String keyword = request.getParameter("keyword");
    if (keyword == null || keyword.trim().isEmpty()) {
        out.print("{\"message\": \"error\", \"detail\": \"검색어를 입력하세요.\"}");
        return;
    }

    MemberVO member = MemberDAO.getInstance().searchMember(keyword);
    if (member != null) {
        out.print("{\"uid\": " + member.getUid() + ", \"id\": \"" + member.getId() + "\", \"name\": \"" + member.getName() + "\", \"email\": \"" + member.getEmail() + "\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        out.print("{\"message\": \"error\", \"detail\": \"존재하지 않는 회원입니다.\"}");
    }
%>