<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="archive.InvitationDAO" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");

    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    request.setCharacterEncoding("UTF-8");

    int aid = Integer.parseInt(request.getParameter("aid"));
    int inviterUid = Integer.parseInt(request.getParameter("inviterUid"));
    int inviteeUid = Integer.parseInt(request.getParameter("inviteeUid"));

    InvitationDAO invitationDAO = InvitationDAO.getInstance();

    // 이미 멤버인지 확인
    if (invitationDAO.isMemberOfArchive(inviteeUid, aid)) {
        response.setStatus(HttpServletResponse.SC_CONFLICT);
        out.print("{\"message\": \"error\", \"detail\": \"이미 저장소 멤버입니다.\"}");
        return;
    }

    // 이미 초대 중인지 확인
    if (invitationDAO.isPendingInvitation(inviteeUid, aid)) {
        response.setStatus(HttpServletResponse.SC_CONFLICT);
        out.print("{\"message\": \"error\", \"detail\": \"이미 초대 중인 회원입니다.\"}");
        return;
    }

    int result = invitationDAO.sendInvitation(aid, inviterUid, inviteeUid);

    if (result > 0) {
        out.print("{\"message\": \"success\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"error\", \"detail\": \"초대 전송 실패\"}");
    }
%>