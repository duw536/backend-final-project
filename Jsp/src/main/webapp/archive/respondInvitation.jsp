<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="archive.InvitationDAO" %>
<%@ page import="archive.ArchiveDAO" %>
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

    int invitationId = Integer.parseInt(request.getParameter("invitationId"));
    String status = request.getParameter("status"); // "accepted" or "rejected"

    InvitationDAO invitationDAO = InvitationDAO.getInstance();

    if ("accepted".equals(status)) {
        int[] info = invitationDAO.getInvitationInfo(invitationId); // [aid, inviteeUid]
        if (info != null) {
            int aid = info[0];
            int inviteeUid = info[1];
            int defaultPermissionId = ArchiveDAO.getInstance().getDefaultPermissionId(aid);
            ArchiveDAO.getInstance().createMemberPermissionMapping(inviteeUid, aid, defaultPermissionId);
        }
    }

    int result = invitationDAO.respondInvitation(invitationId, status);

    if (result > 0) {
        out.print("{\"message\": \"success\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"error\", \"detail\": \"처리 실패\"}");
    }
%>