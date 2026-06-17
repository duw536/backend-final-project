<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="archive.ArchiveDAO" %>
<%@ page import="archivePermission.ArchivePermissionVO" %>
<%@ page import="java.util.List" %>

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

    String aidStr = request.getParameter("aid");
    if (aidStr == null || aidStr.equals("null")) {
        out.print("[]");
        return;
    }

    int aid = Integer.parseInt(aidStr);
    List<ArchivePermissionVO> list = ArchiveDAO.getInstance().getPermissionList(aid);

    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < list.size(); i++) {
        ArchivePermissionVO p = list.get(i);
        if (i > 0) sb.append(",");
        sb.append("{")
          .append("\"permissionId\":").append(p.getPermissionId()).append(",")
          .append("\"permissionName\":\"").append(p.getPermissionName()).append("\"")
          .append("}");
    }
    sb.append("]");
    out.print(sb.toString());
%>