<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="archive.ArchiveDAO" %>
<%@ page import="archivePermission.ArchivePermissionVO" %>
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

    String uidStr = request.getParameter("uid");
    String aidStr = request.getParameter("aid");

    if (uidStr == null || aidStr == null) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("{\"message\": \"error\"}");
        return;
    }

    int uid = Integer.parseInt(uidStr);
    int aid = Integer.parseInt(aidStr);

    ArchivePermissionVO perm = ArchiveDAO.getInstance().getMemberPermission(uid, aid);

    if (perm != null) {
        out.print("{" +
            "\"canManageMember\": " + perm.getCanManageMember() + "," +
            "\"canManageInfo\": " + perm.getCanManageInfo() + "," +
            "\"canManageTag\": " + perm.getCanManageTag() +
        "}");
    } else {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        out.print("{\"message\": \"error\", \"detail\": \"권한 없음\"}");
    }
%>